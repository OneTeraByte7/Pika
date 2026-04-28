from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
from bson import ObjectId

from server.models.dating import RecommendationResponse, DatingProfileResponse
from server.services.dating_services import ProfileService, MatchingService, InteractionService


class RecommendationEngine:
    """AI-powered recommendation engine for profile suggestions."""

    def __init__(self, db):
        self.db = db
        self.profile_service = ProfileService(db)
        self.matching_service = MatchingService(db)
        self.interaction_service = InteractionService(db)
        self.profiles_collection = db["dating_profiles"]
        self.swipes_collection = db["dating_swipes"]

    async def get_top_matches(self, profile_id: str, limit: int = 10) -> List[RecommendationResponse]:
        """Get top compatible matches using multiple algorithms."""
        profile = await self.profile_service.get_profile(profile_id)
        if not profile:
            return []

        # Get candidates from different matching algorithms
        preference_candidates = await self.matching_service.preference_based_matching(profile_id)
        vector_matches = await self.matching_service.vector_based_matching(profile_id, limit=50)

        # Combine and score
        scored_profiles: Dict[str, float] = {}

        # Add preference-based matches
        for candidate_id in preference_candidates:
            scored_profiles[candidate_id] = scored_profiles.get(candidate_id, 0) + 30

        # Add vector-based matches with higher weight
        for candidate_id, score in vector_matches:
            scored_profiles[candidate_id] = scored_profiles.get(candidate_id, 0) + score

        # Add boost for recently active profiles
        active_profiles = await self.matching_service.real_time_matching(profile_id, limit=20)
        for active_id in active_profiles:
            scored_profiles[active_id] = scored_profiles.get(active_id, 0) + 15

        # Filter out already swiped/matched
        filtered_scores = await self._filter_seen_profiles(profile_id, scored_profiles)

        # Sort and get top results
        top_ids = sorted(filtered_scores.items(), key=lambda x: x[1], reverse=True)[:limit]

        recommendations = []
        for profile_id_rec, score in top_ids:
            rec_profile = await self.profile_service.get_profile(profile_id_rec)
            if rec_profile:
                recommendations.append(RecommendationResponse(
                    profile=rec_profile,
                    compatibility_score=min(score, 100),
                    match_reason=self._get_match_reason(profile, rec_profile, score)
                ))

        return recommendations

    async def get_suggestions(self, profile_id: str, suggestion_type: str = "daily") -> List[RecommendationResponse]:
        """Get personalized suggestions based on profile activity."""
        profile = await self.profile_service.get_profile(profile_id)
        if not profile:
            return []

        if suggestion_type == "daily":
            return await self.get_top_matches(profile_id, limit=5)
        elif suggestion_type == "discover":
            return await self._get_discovery_suggestions(profile_id)
        elif suggestion_type == "nearby":
            return await self._get_nearby_suggestions(profile_id)
        else:
            return await self.get_top_matches(profile_id, limit=10)

    async def detect_mutual_interests(self, profile1_id: str, profile2_id: str) -> List[str]:
        """Detect shared interests between two profiles."""
        profile1 = await self.profile_service.get_profile(profile1_id)
        profile2 = await self.profile_service.get_profile(profile2_id)

        if not profile1 or not profile2:
            return []

        interests1 = set(profile1.interests)
        interests2 = set(profile2.interests)
        return list(interests1 & interests2)

    async def calculate_compatibility(self, profile1_id: str, profile2_id: str) -> float:
        """Calculate detailed compatibility score between two profiles."""
        profile1 = await self.profile_service.get_profile(profile1_id)
        profile2 = await self.profile_service.get_profile(profile2_id)

        if not profile1 or not profile2:
            return 0.0

        score = 0.0

        # Age compatibility (±5 years preferred)
        age_diff = abs(profile1.age - profile2.age)
        age_score = max(0, 30 - (age_diff * 2))
        score += age_score

        # Interest overlap
        interests1 = set(profile1.interests)
        interests2 = set(profile2.interests)
        if interests1 and interests2:
            overlap = len(interests1 & interests2)
            total = len(interests1 | interests2)
            interest_score = (overlap / total) * 40
            score += interest_score

        # Height compatibility (if available)
        if profile1.height_cm and profile2.height_cm:
            height_diff = abs(profile1.height_cm - profile2.height_cm)
            height_score = max(0, 15 - (height_diff / 5))
            score += height_score

        # Location proximity bonus
        distance = MatchingService._calculate_distance(profile1.location, profile2.location)
        if distance < 10:
            score += 15
        elif distance < 50:
            score += 10

        return min(score, 100)

    async def _filter_seen_profiles(self, profile_id: str, candidates: Dict[str, float]) -> Dict[str, float]:
        """Remove profiles that user has already swiped."""
        swipes = await self.swipes_collection.find({"from_profile_id": profile_id}).to_list(None)
        swiped_ids = {swipe["to_profile_id"] for swipe in swipes}

        # Also remove matched profiles from candidates
        matches = await self.interaction_service.get_matches(profile_id)
        matched_ids = set()
        for match in matches:
            for pid in match.profile_ids:
                if pid != profile_id:
                    matched_ids.add(pid)

        # Check for blocks
        blocked = await self.db["blocked_users"].find({
            "$or": [
                {"blocker_profile_id": profile_id},
                {"blocked_profile_id": profile_id}
            ]
        }).to_list(None)
        blocked_ids = {b["blocked_profile_id"] for b in blocked} | {b["blocker_profile_id"] for b in blocked}

        filtered = {}
        for candidate_id, score in candidates.items():
            if candidate_id not in swiped_ids and candidate_id not in matched_ids and candidate_id not in blocked_ids:
                filtered[candidate_id] = score

        return filtered

    async def _get_discovery_suggestions(self, profile_id: str, limit: int = 10) -> List[RecommendationResponse]:
        """Get profiles outside normal preferences for discovery."""
        profile = await self.profile_service.get_profile(profile_id)
        if not profile:
            return []

        # Get profiles with diverse interests
        all_profiles = await self.profiles_collection.find(
            {"_id": {"$ne": ObjectId(profile_id)}}
        ).to_list(None)

        # Score by interest diversity
        scored = []
        profile_interests = set(profile.interests)

        for candidate in all_profiles:
            candidate_interests = set(candidate.get("interests", []))
            # Find new interests
            new_interests = candidate_interests - profile_interests
            if new_interests:
                score = len(new_interests) * 10
                scored.append((str(candidate["_id"]), score))

        scored.sort(key=lambda x: x[1], reverse=True)

        recommendations = []
        for candidate_id, _ in scored[:limit]:
            rec_profile = await self.profile_service.get_profile(candidate_id)
            if rec_profile:
                recommendations.append(RecommendationResponse(
                    profile=rec_profile,
                    compatibility_score=50,
                    match_reason="New interests to explore"
                ))

        return recommendations

    async def _get_nearby_suggestions(self, profile_id: str, limit: int = 10) -> List[RecommendationResponse]:
        """Get nearby profiles sorted by distance."""
        profile = await self.profile_service.get_profile(profile_id)
        if not profile:
            return []

        all_profiles = await self.profiles_collection.find(
            {"_id": {"$ne": ObjectId(profile_id)}}
        ).to_list(None)

        # Calculate distances and sort
        distances = []
        for candidate in all_profiles:
            distance = MatchingService._calculate_distance(profile.location, candidate["location"])
            distances.append((str(candidate["_id"]), distance))

        distances.sort(key=lambda x: x[1])

        recommendations = []
        for candidate_id, distance in distances[:limit]:
            rec_profile = await self.profile_service.get_profile(candidate_id)
            if rec_profile:
                recommendations.append(RecommendationResponse(
                    profile=rec_profile,
                    compatibility_score=min(100 - (distance / 5), 100),
                    match_reason=f"Only {distance:.1f} km away"
                ))

        return recommendations

    @staticmethod
    def _get_match_reason(profile1: DatingProfileResponse, profile2: DatingProfileResponse, score: float) -> str:
        """Generate a human-readable reason for the match."""
        if score > 80:
            return "Excellent match based on preferences and interests"
        elif score > 60:
            return "Great match with shared interests"
        elif score > 40:
            return "Good match worth exploring"
        else:
            return "Interesting profile nearby"
