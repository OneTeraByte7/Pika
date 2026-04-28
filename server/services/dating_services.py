from typing import List, Dict, Optional, Tuple
from datetime import datetime
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
import math

from server.models.dating import (
    DatingProfileCreate, DatingProfileResponse,
    UserPreferenceCreate, UserPreferenceResponse,
    SwipeCreate, SwipeResponse, SwipeAction,
    MatchResponse, LikeResponse,
    BlockedUserResponse, ReportResponse,
    InterestCategory, GenderEnum
)


class ProfileService:
    """Manages dating profile CRUD operations and Pika account linking."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.profiles_collection = db["dating_profiles"]
        self.preferences_collection = db["user_preferences"]
        self.photos_collection = db["dating_photos"]

    async def create_profile(self, profile_data: DatingProfileCreate, user_id: str) -> DatingProfileResponse:
        """Create a new dating profile."""
        profile_doc = {
            "_id": ObjectId(),
            "user_id": user_id,
            "bio": profile_data.bio,
            "age": profile_data.age,
            "gender": profile_data.gender.value,
            "location": profile_data.location,
            "height_cm": profile_data.height_cm,
            "interests": [i.value for i in profile_data.interests],
            "photos": [{"url": p.url, "caption": p.caption, "is_primary": p.is_primary, "created_at": datetime.utcnow()} for p in profile_data.photos],
            "linked_pika_user_id": profile_data.linked_pika_user_id,
            "verified": profile_data.verified,
            "profile_views": 0,
            "likes_received": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await self.profiles_collection.insert_one(profile_doc)
        return await self.get_profile(str(result.inserted_id))

    async def get_profile(self, profile_id: str) -> Optional[DatingProfileResponse]:
        """Retrieve a dating profile by ID."""
        try:
            profile = await self.profiles_collection.find_one({"_id": ObjectId(profile_id)})
            if profile:
                profile["id"] = str(profile["_id"])
                return DatingProfileResponse(**profile)
        except Exception:
            pass
        return None

    async def get_user_profile(self, user_id: str) -> Optional[DatingProfileResponse]:
        """Get dating profile for a user."""
        profile = await self.profiles_collection.find_one({"user_id": user_id})
        if profile:
            profile["id"] = str(profile["_id"])
            return DatingProfileResponse(**profile)
        return None

    async def update_profile(self, profile_id: str, updates: Dict) -> Optional[DatingProfileResponse]:
        """Update a dating profile."""
        try:
            updates["updated_at"] = datetime.utcnow()
            await self.profiles_collection.update_one(
                {"_id": ObjectId(profile_id)},
                {"$set": updates}
            )
            return await self.get_profile(profile_id)
        except Exception:
            return None

    async def delete_profile(self, profile_id: str) -> bool:
        """Delete a dating profile."""
        try:
            result = await self.profiles_collection.delete_one({"_id": ObjectId(profile_id)})
            return result.deleted_count > 0
        except Exception:
            return False

    async def link_pika_user(self, profile_id: str, pika_user_id: str) -> Optional[DatingProfileResponse]:
        """Link a dating profile to a Pika user account."""
        return await self.update_profile(profile_id, {"linked_pika_user_id": pika_user_id})

    async def upload_photo(self, profile_id: str, photo_url: str, caption: Optional[str] = None, is_primary: bool = False) -> Optional[DatingProfileResponse]:
        """Add a photo to a dating profile."""
        profile = await self.get_profile(profile_id)
        if not profile:
            return None

        new_photo = {
            "url": photo_url,
            "caption": caption,
            "is_primary": is_primary,
            "created_at": datetime.utcnow()
        }

        await self.profiles_collection.update_one(
            {"_id": ObjectId(profile_id)},
            {"$push": {"photos": new_photo}}
        )
        return await self.get_profile(profile_id)

    async def increment_profile_views(self, profile_id: str) -> None:
        """Increment view count for a profile."""
        try:
            await self.profiles_collection.update_one(
                {"_id": ObjectId(profile_id)},
                {"$inc": {"profile_views": 1}}
            )
        except Exception:
            pass

    async def increment_likes(self, profile_id: str) -> None:
        """Increment likes received count."""
        try:
            await self.profiles_collection.update_one(
                {"_id": ObjectId(profile_id)},
                {"$inc": {"likes_received": 1}}
            )
        except Exception:
            pass

    async def set_user_preference(self, user_id: str, preference_data: UserPreferenceCreate) -> UserPreferenceResponse:
        """Create or update user dating preferences."""
        existing = await self.preferences_collection.find_one({"user_id": user_id})

        preference_doc = {
            "user_id": user_id,
            "min_age": preference_data.min_age,
            "max_age": preference_data.max_age,
            "preferred_genders": [g.value for g in preference_data.preferred_genders],
            "max_distance_km": preference_data.max_distance_km,
            "interests": [i.value for i in preference_data.interests],
            "height_cm_min": preference_data.height_cm_min,
            "height_cm_max": preference_data.height_cm_max,
            "updated_at": datetime.utcnow()
        }

        if existing:
            preference_doc["created_at"] = existing.get("created_at", datetime.utcnow())
            await self.preferences_collection.update_one(
                {"user_id": user_id},
                {"$set": preference_doc}
            )
            pref_id = str(existing["_id"])
        else:
            preference_doc["_id"] = ObjectId()
            preference_doc["created_at"] = datetime.utcnow()
            result = await self.preferences_collection.insert_one(preference_doc)
            pref_id = str(result.inserted_id)

        pref = await self.preferences_collection.find_one({"_id": ObjectId(pref_id)})
        pref["id"] = pref_id
        return UserPreferenceResponse(**pref)

    async def get_user_preference(self, user_id: str) -> Optional[UserPreferenceResponse]:
        """Get user's dating preferences."""
        pref = await self.preferences_collection.find_one({"user_id": user_id})
        if pref:
            pref["id"] = str(pref["_id"])
            return UserPreferenceResponse(**pref)
        return None


class MatchingService:
    """Implements multiple matching algorithms."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.profiles_collection = db["dating_profiles"]
        self.preferences_collection = db["user_preferences"]
        self.profile_service = ProfileService(db)

    async def preference_based_matching(self, profile_id: str) -> List[str]:
        """Filter profiles based on user preferences."""
        profile = await self.profile_service.get_profile(profile_id)
        if not profile:
            return []

        # Get user preferences
        pref = await self.profile_service.get_user_preference(profile.linked_pika_user_id) if profile.linked_pika_user_id else None
        
        if not pref:
            # Return all profiles if no preferences set
            return await self._get_all_available_profiles(profile_id)

        # Build query
        query = {
            "_id": {"$ne": ObjectId(profile_id)},
            "age": {"$gte": pref.min_age, "$lte": pref.max_age},
            "gender": {"$in": pref.preferred_genders}
        }

        if pref.height_cm_min or pref.height_cm_max:
            height_query = {}
            if pref.height_cm_min:
                height_query["$gte"] = pref.height_cm_min
            if pref.height_cm_max:
                height_query["$lte"] = pref.height_cm_max
            if height_query:
                query["height_cm"] = height_query

        candidates = await self.profiles_collection.find(query).to_list(100)
        
        # Filter by distance if set
        if pref.max_distance_km:
            filtered = []
            for candidate in candidates:
                distance = self._calculate_distance(profile.location, candidate["location"])
                if distance <= pref.max_distance_km:
                    filtered.append(str(candidate["_id"]))
            return filtered
        
        return [str(c["_id"]) for c in candidates]

    async def vector_based_matching(self, profile_id: str, limit: int = 20) -> List[Tuple[str, float]]:
        """Match profiles using interest vector similarity."""
        profile = await self.profile_service.get_profile(profile_id)
        if not profile or not profile.interests:
            return []

        profile_interests = set(profile.interests)
        candidates = await self.profiles_collection.find(
            {"_id": {"$ne": ObjectId(profile_id)}}
        ).to_list(None)

        scored = []
        for candidate in candidates:
            candidate_interests = set(candidate.get("interests", []))
            if not candidate_interests:
                continue

            # Jaccard similarity
            intersection = len(profile_interests & candidate_interests)
            union = len(profile_interests | candidate_interests)
            similarity = intersection / union if union > 0 else 0

            scored.append((str(candidate["_id"]), similarity * 100))

        scored.sort(key=lambda x: x[1], reverse=True)
        return scored[:limit]

    async def real_time_matching(self, profile_id: str, limit: int = 10) -> List[str]:
        """Get actively engaged profiles for real-time discovery."""
        # Get recent interactions
        swipes = await self.db["dating_swipes"].find(
            {"from_profile_id": {"$ne": profile_id}}
        ).sort("created_at", -1).limit(200).to_list(None)

        # Get profiles involved in recent interactions
        active_profile_ids = set()
        for swipe in swipes:
            active_profile_ids.add(swipe["to_profile_id"])

        active_profile_ids.discard(profile_id)
        
        if not active_profile_ids:
            return await self.preference_based_matching(profile_id)

        return list(active_profile_ids)[:limit]

    async def _get_all_available_profiles(self, profile_id: str) -> List[str]:
        """Get all profiles except the current one."""
        profiles = await self.profiles_collection.find(
            {"_id": {"$ne": ObjectId(profile_id)}}
        ).to_list(100)
        return [str(p["_id"]) for p in profiles]

    @staticmethod
    def _calculate_distance(loc1: Dict, loc2: Dict) -> float:
        """Calculate distance in km between two lat/lon points using Haversine formula."""
        R = 6371  # Earth's radius in km
        
        lat1 = math.radians(loc1.get("latitude", 0))
        lon1 = math.radians(loc1.get("longitude", 0))
        lat2 = math.radians(loc2.get("latitude", 0))
        lon2 = math.radians(loc2.get("longitude", 0))

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))

        return R * c


class InteractionService:
    """Handles swipes, likes, and matches."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.swipes_collection = db["dating_swipes"]
        self.matches_collection = db["dating_matches"]
        self.likes_collection = db["dating_likes"]
        self.blocked_collection = db["blocked_users"]
        self.profile_service = ProfileService(db)

    async def swipe_right(self, from_profile_id: str, to_profile_id: str) -> SwipeResponse:
        """Like a profile (swipe right)."""
        swipe_doc = {
            "_id": ObjectId(),
            "from_profile_id": from_profile_id,
            "to_profile_id": to_profile_id,
            "action": SwipeAction.RIGHT.value,
            "created_at": datetime.utcnow()
        }

        result = await self.swipes_collection.insert_one(swipe_doc)
        is_match = await self._check_mutual_like(from_profile_id, to_profile_id)

        if is_match:
            await self._create_match(from_profile_id, to_profile_id)

        swipe_doc["is_match"] = is_match
        await self.profile_service.increment_likes(to_profile_id)
        
        return SwipeResponse(
            id=str(result.inserted_id),
            from_profile_id=from_profile_id,
            to_profile_id=to_profile_id,
            action=SwipeAction.RIGHT,
            created_at=swipe_doc["created_at"],
            is_match=is_match
        )

    async def swipe_left(self, from_profile_id: str, to_profile_id: str) -> SwipeResponse:
        """Pass on a profile (swipe left)."""
        swipe_doc = {
            "_id": ObjectId(),
            "from_profile_id": from_profile_id,
            "to_profile_id": to_profile_id,
            "action": SwipeAction.LEFT.value,
            "created_at": datetime.utcnow()
        }

        result = await self.swipes_collection.insert_one(swipe_doc)
        return SwipeResponse(
            id=str(result.inserted_id),
            from_profile_id=from_profile_id,
            to_profile_id=to_profile_id,
            action=SwipeAction.LEFT,
            created_at=swipe_doc["created_at"],
            is_match=False
        )

    async def get_matches(self, profile_id: str) -> List[MatchResponse]:
        """Get all matches for a profile."""
        matches = await self.matches_collection.find({
            "profile_ids": profile_id
        }).to_list(None)

        result = []
        for match in matches:
            result.append(MatchResponse(
                id=str(match["_id"]),
                profile_ids=match["profile_ids"],
                created_at=match["created_at"],
                last_interaction=match.get("last_interaction"),
                unread_count=match.get("unread_count", 0)
            ))
        return result

    async def get_match_with_profile(self, profile_id: str, other_profile_id: str) -> Optional[MatchResponse]:
        """Get specific match between two profiles."""
        match = await self.matches_collection.find_one({
            "profile_ids": {"$all": [profile_id, other_profile_id]}
        })
        if match:
            return MatchResponse(
                id=str(match["_id"]),
                profile_ids=match["profile_ids"],
                created_at=match["created_at"],
                last_interaction=match.get("last_interaction"),
                unread_count=match.get("unread_count", 0)
            )
        return None

    async def block_user(self, from_profile_id: str, to_profile_id: str) -> BlockedUserResponse:
        """Block a user."""
        block_doc = {
            "_id": ObjectId(),
            "blocker_profile_id": from_profile_id,
            "blocked_profile_id": to_profile_id,
            "created_at": datetime.utcnow()
        }
        result = await self.blocked_collection.insert_one(block_doc)
        return BlockedUserResponse(
            id=str(result.inserted_id),
            blocker_profile_id=from_profile_id,
            blocked_profile_id=to_profile_id,
            created_at=block_doc["created_at"]
        )

    async def is_blocked(self, from_profile_id: str, to_profile_id: str) -> bool:
        """Check if one user is blocked by another."""
        blocked = await self.blocked_collection.find_one({
            "blocker_profile_id": to_profile_id,
            "blocked_profile_id": from_profile_id
        })
        return blocked is not None

    async def _check_mutual_like(self, profile1_id: str, profile2_id: str) -> bool:
        """Check if two profiles have liked each other."""
        reverse_swipe = await self.swipes_collection.find_one({
            "from_profile_id": profile2_id,
            "to_profile_id": profile1_id,
            "action": SwipeAction.RIGHT.value
        })
        return reverse_swipe is not None

    async def _create_match(self, profile1_id: str, profile2_id: str) -> str:
        """Create a match between two profiles."""
        match_doc = {
            "_id": ObjectId(),
            "profile_ids": sorted([profile1_id, profile2_id]),
            "created_at": datetime.utcnow(),
            "last_interaction": None,
            "unread_count": 0
        }
        result = await self.matches_collection.insert_one(match_doc)
        return str(result.inserted_id)
