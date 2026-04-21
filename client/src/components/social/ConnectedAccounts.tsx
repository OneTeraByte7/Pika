import Link from 'next/link';

export default function ConnectedAccounts() {
    return (
        <div className="space-y-4">
            <h3 className="font-bold">Connected Accounts</h3>
            <ul className="space-y-2">
                <li className="flex items-center justify-between p-3 bg-white/5 rounded-2xl">
                    <div>
                        <div className="font-semibold">Twitter</div>
                        <div className="text-sm text-white/40">@yourhandle</div>
                    </div>
                    <Link href="/connect/twitter" className="text-sm">Manage</Link>
                </li>
                <li className="flex items-center justify-between p-3 bg-white/5 rounded-2xl">
                    <div>
                        <div className="font-semibold">Instagram</div>
                        <div className="text-sm text-white/40">@yourgram</div>
                    </div>
                    <Link href="/connect/instagram" className="text-sm">Manage</Link>
                </li>
            </ul>
        </div>
    );
}
