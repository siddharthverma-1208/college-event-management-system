<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>College Event Management System - API</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
    <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl mb-6">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                College Event Management System
            </h1>
            <p class="text-slate-400 text-lg">Backend API Documentation</p>
        </div>

        <!-- API Status -->
        <div class="bg-slate-800 rounded-2xl p-6 mb-8 border border-slate-700">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span class="text-emerald-400 font-semibold">API is Running</span>
            </div>
            <p class="text-slate-400">Base URL: <code class="bg-slate-700 px-2 py-1 rounded"><?= 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) ?>/api</code></p>
        </div>

        <!-- API Endpoints -->
        <div class="space-y-6">
            <h2 class="text-2xl font-bold text-white mb-4">📚 API Endpoints</h2>
            
            <!-- Events API -->
            <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 class="text-lg font-semibold text-violet-400 mb-4">🎉 Events API</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/events.php</code>
                        <span class="text-slate-500 text-sm">- Get all events</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/events.php?id=1</code>
                        <span class="text-slate-500 text-sm">- Get single event</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-mono">POST</span>
                        <code class="text-slate-300">/api/events.php</code>
                        <span class="text-slate-500 text-sm">- Create event (admin)</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-sm font-mono">PUT</span>
                        <code class="text-slate-300">/api/events.php?id=1</code>
                        <span class="text-slate-500 text-sm">- Update event (admin)</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm font-mono">DELETE</span>
                        <code class="text-slate-300">/api/events.php?id=1</code>
                        <span class="text-slate-500 text-sm">- Delete event (admin)</span>
                    </div>
                </div>
            </div>

            <!-- Students API -->
            <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 class="text-lg font-semibold text-violet-400 mb-4">🎓 Students API</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/students.php</code>
                        <span class="text-slate-500 text-sm">- Get all students</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/students.php?event_id=1</code>
                        <span class="text-slate-500 text-sm">- Filter by event</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/students.php?search=name</code>
                        <span class="text-slate-500 text-sm">- Search students</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-mono">POST</span>
                        <code class="text-slate-300">/api/students.php</code>
                        <span class="text-slate-500 text-sm">- Register student</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm font-mono">DELETE</span>
                        <code class="text-slate-300">/api/students.php?id=1</code>
                        <span class="text-slate-500 text-sm">- Delete registration (admin)</span>
                    </div>
                </div>
            </div>

            <!-- Admin API -->
            <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 class="text-lg font-semibold text-violet-400 mb-4">🔐 Admin API</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-mono">POST</span>
                        <code class="text-slate-300">/api/admin.php?action=login</code>
                        <span class="text-slate-500 text-sm">- Admin login</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-mono">POST</span>
                        <code class="text-slate-300">/api/admin.php?action=logout</code>
                        <span class="text-slate-500 text-sm">- Admin logout</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/admin.php?action=check</code>
                        <span class="text-slate-500 text-sm">- Check login status</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/admin.php?action=stats</code>
                        <span class="text-slate-500 text-sm">- Dashboard stats (admin)</span>
                    </div>
                </div>
            </div>

            <!-- Export API -->
            <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <h3 class="text-lg font-semibold text-violet-400 mb-4">📥 Export API</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/export.php</code>
                        <span class="text-slate-500 text-sm">- Export all to CSV (admin)</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-sm font-mono">GET</span>
                        <code class="text-slate-300">/api/export.php?event_id=1</code>
                        <span class="text-slate-500 text-sm">- Export by event (admin)</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Credentials -->
        <div class="mt-8 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-2xl p-6 border border-violet-500/30">
            <h3 class="text-lg font-semibold text-violet-400 mb-4">🔑 Default Admin Credentials</h3>
            <div class="flex gap-8">
                <div>
                    <span class="text-slate-500 text-sm">Username:</span>
                    <code class="ml-2 bg-slate-700 px-3 py-1 rounded text-white">admin</code>
                </div>
                <div>
                    <span class="text-slate-500 text-sm">Password:</span>
                    <code class="ml-2 bg-slate-700 px-3 py-1 rounded text-white">admin123</code>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="mt-12 text-center text-slate-500 text-sm">
            <p>College Event Management System © 2024</p>
            <p class="mt-1">Built with PHP + MySQL</p>
        </div>
    </div>
</body>
</html>
