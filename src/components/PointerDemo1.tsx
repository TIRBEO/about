"use client"
import { motion } from "framer-motion"
import { Pointer } from "./Pointer"

export function PointerDemo1() {
  return (
    <div className="min-h-screen bg-[#0b1220] py-12 px-6 md:py-20 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-4 text-center text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Custom Pointer Effects
        </h1>
        <p className="mb-12 text-center text-lg text-gray-400 md:text-xl max-w-2xl mx-auto">
          Interactive Pointer component with smooth animations and customizable designs for your web applications.
        </p>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Animated Heart Pointer */}
          <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg">
              <motion.div
                animate={{ scale: [0.8, 1, 0.8], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-pink-600"
                >
                  <motion.path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    fill="currentColor"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
            </div>
            
            <h3 className="mb-2 text-xl font-semibold text-white">Animated Pointer</h3>
            <p className="text-sm text-gray-400">
              A custom pointer with heart icon and smooth animations
            </p>
            
            <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-4">
              <Pointer>
                <motion.div
                  animate={{ scale: [0.8, 1, 0.8], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-pink-600"
                  >
                    <motion.path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="currentColor"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                </motion.div>
              </Pointer>
            </div>
          </div>

          {/* Animated Pointer */}
          <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-600"
              >
                <path d="M12 2l-5.5 9h11zM12 2v20m0-20l5.5 9h-11z" />
              </svg>
            </div>
            
            <h3 className="mb-2 text-xl font-semibold text-white">Directional Pointer</h3>
            <p className="text-sm text-gray-400">
              A blue directional pointer indicating scroll direction
            </p>
            
            <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-4 flex justify-center items-center h-20">
              <Pointer className="fill-blue-500">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-blue-600"
                  >
                    <path d="M12 2l-5.5 9h11zM12 2v20m0-20l5.5 9h-11z" />
                  </svg>
                </div>
              </Pointer>
            </div>
          </div>

          {/* Custom Shape Pointer */}
          <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" className="fill-purple-500" />
                <circle cx="12" cy="12" r="5" className="fill-white" />
              </svg>
            </div>
            
            <h3 className="mb-2 text-xl font-semibold text-white">Custom Shape</h3>
            <p className="text-sm text-gray-400">
              A pointer with a custom SVG ring and inner circle
            </p>
            
            <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-4 flex justify-center items-center h-20">
              <Pointer>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" className="fill-purple-500" />
                  <circle cx="12" cy="12" r="5" className="fill-white" />
                </svg>
              </Pointer>
            </div>
          </div>

          {/* Emoji Pointer */}
          <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <div className="text-xl">👆</div>
            </div>
            
            <h3 className="mb-2 text-xl font-semibold text-white">Emoji Pointer</h3>
            <p className="text-sm text-gray-400">
              Using an emoji as a custom pointer
            </p>
            
            <div className="mt-6 rounded-xl border border-white/5 bg-white/5 p-4 flex justify-center items-center h-20">
              <Pointer>
                <div className="text-3xl animate-bounce">👆</div>
              </Pointer>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* FAQ Item 1 */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-8 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3 8-8m0 0h3v3m0-3v3m0 0v3m0-3h-3m-6 0H7m-4 6h8m-4 4l4-4m0 0l4 4m-4-4v8m-8-4h8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">How does the custom pointer work?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The custom pointer uses React state and event listeners to track mouse movements in real-time. It follows your cursor smoothly with smooth transitions and adapts to different themes.
                  </p>
                  <div className="mt-4 flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300">
                    <span>Learn more</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-8 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4h10.5M4 4v10.5M20 8v10.5M20 4v4m0 0h-4m6 0h4M6 20v-4m0 0h10.5M6 20H4m-2-8h8m-2 4h8M6 12h8" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Can I customize the pointer design?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Yes! You can customize the pointer by passing children (SVG, emoji, or any element) and applying custom CSS classes for styling and theming.
                  </p>
                  <div className="mt-4 flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300">
                    <span>Customize now</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-8 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Is performance optimized?</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Yes! The pointer is optimized for performance with smooth transitions, event delegation, and respects user preferences for reduced motion.
                  </p>
                  <div className="mt-4 flex items-center text-pink-400 text-sm font-medium group-hover:text-pink-300">
                    <span>Performance details</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-8 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5C5.19 5 3.5 6.64 3.5 9c0 2.15 1.7 4.23 3.93 5.08 2.07 1.06 4.18 2.24 6.93 2.24 2.75 0 4.86-1.18 6.93-2.24C21.3 12.23 23 10.15 23 9c0-2.36-1.73-4.39-4.16-4.5-1.43-.08-2.84-.26-4.16-.5-1.32-.24-2.53-.44-3.67-.58-.4-.08-.8-.15-1.2-.21-.54-.08-1.08-.14-1.65-.21C7.77 2.2 6.67 2 5.5 2c-1.17 0-2.27.2-3.31.5A3.018 3.018 0 002 4.5c0 2.25 1.87 4.08 4.19 4.5h.17c.53.03 1.07.08 1.62.12.5.05 1 0 1.5.21 1.15.4 2.34.67 3.5.92C15.88 12.48 19.5 13.66 23 15v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Is it accessible</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The Pointer component is accessible and follows WCAG guidelines. It includes proper ARIA attributes and can be keyboard navigable.
                  </p>
                  <div className="mt-4 flex items-center text-green-400 text-sm font-medium group-hover:text-green-300">
                    <span>Accessibility info</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a2132] to-[#0b1220] p-8 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 md:col-span-2">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.5m-.5 4H12M12 8v.01M12 10v4m0 4v.01M20 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Can I use it in different frameworks</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Yes! The Pointer component is framework-agnostic and can be used with React, vanilla JavaScript, or integrated into any existing project. It uses standard React hooks and web APIs.
                  </p>
                  <div className="mt-4 flex items-center text-orange-400 text-sm font-medium group-hover:text-orange-300">
                    <span>Framework compatibility</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
