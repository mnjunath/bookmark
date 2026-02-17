'use client'

import { signInWithGoogle } from '../auth/actions'
import { LogIn } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    console.log('Connecting to Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    }

    const floatVariants: Variants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50"
        >
            {/* Left Side - Intro */}
            <motion.div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-12 flex-col justify-between overflow-hidden relative">
                {/* Animated background circles */}
                <motion.div
                    className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <motion.div
                    className="relative z-10"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.div
                        className="flex items-center space-x-3 mb-12"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                y: [0, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white">Smart Bookmarks</h1>
                    </motion.div>

                    <div className="space-y-8 text-white">
                        <motion.div variants={itemVariants}>
                            <h2 className="text-4xl font-extrabold mb-4">
                                Organize Your Digital Life
                            </h2>
                            <p className="text-xl text-indigo-100">
                                Save, manage, and access your favorite websites from anywhere, anytime.
                            </p>
                        </motion.div>

                        <motion.div className="space-y-6" variants={containerVariants}>
                            {[
                                { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Real-time Sync", desc: "Instant updates across all your devices" },
                                { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure & Private", desc: "Your data is encrypted and protected" },
                                { icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01", title: "Easy to Use", desc: "Simple and intuitive interface" }
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start space-x-4"
                                    variants={itemVariants}
                                    whileHover={{ x: 10, transition: { type: "spring", stiffness: 300 } }}
                                >
                                    <motion.div
                                        className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center"
                                        variants={floatVariants}
                                        animate="animate"
                                        style={{ animationDelay: `${index * 0.2}s` }}
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                                        </svg>
                                    </motion.div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                                        <p className="text-indigo-100">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    className="text-indigo-100 text-sm relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    © 2026 Smart Bookmarks. All rights reserved.
                </motion.div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                    </div>

                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                            Welcome Back
                        </h2>
                        <p className="text-base text-gray-600">
                            Sign in to manage your Smart Bookmarks
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white py-10 px-8 shadow-2xl rounded-2xl border border-gray-100"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                        whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    >
                        <form action={signInWithGoogle}>
                            <motion.button
                                type="submit"
                                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <LogIn className="w-6 h-6 mr-3" />
                                Sign in with Google
                            </motion.button>
                        </form>

                        {message && (
                            <motion.div
                                className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-center rounded-xl"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {message}
                            </motion.div>
                        )}
                    </motion.div>

                    <motion.p
                        className="mt-6 text-center text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Secure authentication powered by Google
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.div >
    )
}

export default function Login() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
