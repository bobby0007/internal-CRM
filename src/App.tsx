import Login from "@/components/Login";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import Communications from "@/pages/Communications";
import Config from "@/pages/Config";
import InternationalTxns from "@/pages/InternationalTxns";
import MerchantStatus from "@/pages/MerchantStatus";
import RateLimit from "@/pages/RateLimit";
import TemplateConfig from "@/pages/TemplateConfig";
import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { isAuthenticated } from "./utils/auth";
const SilentAuthConfig = React.lazy(() => import("@/pages/SilentAuthConfig"));

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />

				{/* Redirect root to dashboard if authenticated, otherwise to login */}
				<Route
					path="/"
					element={
						isAuthenticated() ? (
							<Navigate to="/dashboard" replace />
						) : (
							<Navigate to="/login" replace />
						)
					}
				/>

				{/* Add dashboard route for the main content */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<div className="min-h-screen bg-gray-100">
								<div className="flex h-screen">
									<Sidebar className="hidden lg:block" />
									<div className="flex-1 flex flex-col overflow-hidden">
										<Navbar />
										<main className="flex-1 overflow-y-auto">
											<MerchantStatus />
										</main>
									</div>
								</div>
							</div>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/international"
					element={
						<ProtectedRoute>
							<div className="min-h-screen bg-gray-100">
								<div className="flex h-screen">
									<Sidebar className="hidden lg:block" />
									<div className="flex-1 flex flex-col overflow-hidden">
										<Navbar />
										<main className="flex-1 overflow-y-auto">
											<InternationalTxns />
										</main>
									</div>
								</div>
							</div>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/rate-limit"
					element={
						<ProtectedRoute>
							<div className="min-h-screen bg-gray-100">
								<div className="flex h-screen">
									<Sidebar className="hidden lg:block" />
									<div className="flex-1 flex flex-col overflow-hidden">
										<Navbar />
										<main className="flex-1 overflow-y-auto">
											<RateLimit />
										</main>
									</div>
								</div>
							</div>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/config"
					element={
						<ProtectedRoute>
							<div className="min-h-screen bg-gray-100">
								<div className="flex h-screen">
									<Sidebar className="hidden lg:block" />
									<div className="flex-1 flex flex-col overflow-hidden">
										<Navbar />
										<main className="flex-1 overflow-y-auto">
											<Config />
										</main>
									</div>
								</div>
							</div>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/template-config"
					element={
						<ProtectedRoute>
							<div className="min-h-screen bg-gray-100">
								<div className="flex h-screen">
									<Sidebar className="hidden lg:block" />
									<div className="flex-1 flex flex-col overflow-hidden">
										<Navbar />
										<main className="flex-1 overflow-y-auto">
											<TemplateConfig />
										</main>
									</div>
								</div>
							</div>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/communications"
					element={
						<ProtectedRoute>
							<div className="min-h-screen bg-gray-100">
								<div className="flex h-screen">
									<Sidebar className="hidden lg:block" />
									<div className="flex-1 flex flex-col overflow-hidden">
										<Navbar />
										<main className="flex-1 overflow-y-auto">
											<Communications />
										</main>
									</div>
								</div>
							</div>
						</ProtectedRoute>
					}
				/>

				<Route
					path="/silent-auth-config"
					element={
						<ProtectedRoute>
							<div className="min-h-screen bg-gray-100">
								<div className="flex h-screen">
									<Sidebar className="hidden lg:block" />
									<div className="flex-1 flex flex-col overflow-hidden">
										<Navbar />
										<main className="flex-1 overflow-y-auto">
											<React.Suspense fallback={<div>Loading...</div>}>
												<SilentAuthConfig />
											</React.Suspense>
										</main>
									</div>
								</div>
							</div>
						</ProtectedRoute>
					}
				/>

				{/* Redirect unknown routes to root */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster />
		</BrowserRouter>
	);
}

export default App;
