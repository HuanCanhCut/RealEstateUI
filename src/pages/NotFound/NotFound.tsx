'use client'

import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

import Button from '~/components/Button'

// Floating book animation component
const FloatingBook = ({ delay, x, y, rotate }: { delay: number; x: number; y: number; rotate: number }) => (
    <motion.div
        className="absolute text-4xl"
        style={{ left: `${x}%`, top: `${y}%` }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
            opacity: [0.3, 0.7, 0.3],
            y: [0, -15, 0],
            rotate: [rotate - 5, rotate + 5, rotate - 5],
        }}
        transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    >
        📚
    </motion.div>
)

// Stars sparkle animation
const Sparkle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
    <motion.div
        className="absolute text-xl"
        style={{ left: `${x}%`, top: `${y}%` }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
        }}
        transition={{
            duration: 2,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
    >
        ✨
    </motion.div>
)

export default function NotFound() {
    return (
        <div className="bg-background relative flex min-h-dvh items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />

            {/* Floating books */}
            <FloatingBook delay={0} x={10} y={20} rotate={-15} />
            <FloatingBook delay={0.5} x={85} y={15} rotate={10} />
            <FloatingBook delay={1} x={75} y={70} rotate={-10} />
            <FloatingBook delay={1.5} x={15} y={75} rotate={15} />
            <FloatingBook delay={2} x={50} y={10} rotate={5} />

            {/* Sparkles */}
            <Sparkle delay={0} x={20} y={30} />
            <Sparkle delay={0.3} x={80} y={25} />
            <Sparkle delay={0.6} x={70} y={60} />
            <Sparkle delay={0.9} x={25} y={65} />
            <Sparkle delay={1.2} x={60} y={80} />
            <Sparkle delay={1.5} x={40} y={15} />

            {/* Main content */}
            <div className="relative z-10 px-4 text-center">
                {/* Animated 404 number */}
                <motion.div
                    className="mb-4 flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.span
                        className="bg-linear-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-[120px] font-black text-transparent select-none sm:text-[180px]"
                        animate={{ rotate: [-3, 3, -3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        4
                    </motion.span>

                    {/* Animated face in the middle */}
                    <motion.div
                        className="relative mx-[-10px]"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-rose-400 to-orange-400 shadow-2xl sm:h-36 sm:w-36">
                            {/* Sad face */}
                            <motion.div
                                className="relative"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                {/* Eyes */}
                                <div className="mb-2 flex gap-4 sm:gap-6">
                                    <motion.div
                                        className="h-3 w-3 rounded-full bg-white sm:h-4 sm:w-4"
                                        animate={{ scaleY: [1, 0.1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                    />
                                    <motion.div
                                        className="h-3 w-3 rounded-full bg-white sm:h-4 sm:w-4"
                                        animate={{ scaleY: [1, 0.1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                                    />
                                </div>
                                {/* Sad mouth */}
                                <motion.div
                                    className="mx-auto h-3 w-8 rounded-b-full border-b-4 border-white sm:h-4 sm:w-10"
                                    animate={{ scaleX: [1, 0.9, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </motion.div>
                        </div>

                        {/* Floating tear */}
                        <motion.div
                            className="absolute top-8 right-2 text-lg sm:top-12"
                            initial={{ opacity: 0, y: 0 }}
                            animate={{
                                opacity: [0, 1, 1, 0],
                                y: [0, 10, 20, 30],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 1,
                            }}
                        >
                            💧
                        </motion.div>
                    </motion.div>

                    <motion.span
                        className="bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-[120px] font-black text-transparent select-none sm:text-[180px]"
                        animate={{ rotate: [3, -3, 3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        4
                    </motion.span>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h2 className="mb-3 text-2xl font-bold text-slate-800 sm:text-3xl dark:text-white">
                        Ối! Trang bạn tìm đã bay mất rồi!
                    </h2>
                    <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
                        Có vẻ như trang này đang trốn đâu đó trong ứng dụng...
                    </p>
                </motion.div>

                {/* Animated illustration */}
                <motion.div
                    className="mb-8 flex justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                    <motion.div
                        className="relative"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {/* Stack of books */}
                        <div className="flex flex-col items-center gap-1">
                            <motion.div
                                className="h-4 w-16 rounded-sm bg-linear-to-r from-blue-400 to-blue-500 shadow-md"
                                animate={{ rotate: [-2, 2, -2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="h-4 w-20 rounded-sm bg-linear-to-r from-green-400 to-green-500 shadow-md"
                                animate={{ rotate: [1, -1, 1] }}
                                transition={{ duration: 2.2, repeat: Infinity }}
                            />
                            <motion.div
                                className="h-4 w-14 rounded-sm bg-linear-to-r from-purple-400 to-purple-500 shadow-md"
                                animate={{ rotate: [-1, 2, -1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                            />
                            <motion.div
                                className="h-4 w-18 rounded-sm bg-linear-to-r from-pink-400 to-pink-500 shadow-md"
                                animate={{ rotate: [2, -2, 2] }}
                                transition={{ duration: 2.5, repeat: Infinity }}
                            />
                        </div>

                        {/* Question mark floating above */}
                        <motion.div
                            className="absolute -top-8 -right-8 text-4xl"
                            animate={{
                                y: [-5, 5, -5],
                                rotate: [-10, 10, -10],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            ❓
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Link to="/">
                        <Button
                            size="lg"
                            className="group gap-2 px-6 text-base shadow-lg transition-all hover:scale-105"
                        >
                            <motion.div animate={{ x: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity }}>
                                <Home className="h-5 w-5" />
                            </motion.div>
                            Về trang chủ
                        </Button>
                    </Link>
                </motion.div>

                {/* Fun tip */}
                <motion.p
                    className="mt-8 text-sm text-slate-500 dark:text-slate-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    💡 Mẹo: Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ nhé!
                </motion.p>
            </div>
        </div>
    )
}
