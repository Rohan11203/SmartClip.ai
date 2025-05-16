// src/components/ProcessingModal.jsx
import { Fragment } from 'react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { useVideoProcessing } from "@/hooks/useVideoProcessing";

export default function ProcessingModal({ isOpen, onComplete }:any) {
  const { currentStep, progress, done } = useVideoProcessing(isOpen);

  // when done, call parent’s onComplete()
  if (done && isOpen) {
    setTimeout(onComplete, 1000);
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={() => {}}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0" enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <DialogPanel className="fixed inset-0 " />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition-transform ease-out duration-300"
            enterFrom="scale-95 opacity-0" enterTo="scale-100 opacity-100"
            leave="transition-transform ease-in duration-200"
            leaveFrom="scale-100 opacity-100" leaveTo="scale-95 opacity-0"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
              <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Processing your video
              </Dialog.Title>

              {/* Step text */}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                {currentStep}
              </p>

              

              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="h-2 bg-orange-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 text-right">
                {progress}%
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                This usually takes a 10 seconds for 10 seconds video. Please wait while we process your video.
              </p>


              {/* Optionally disable closing until done */}
              <button
                onClick={onComplete}
                disabled={!done}
                className={`mt-4 w-full py-2 rounded-lg font-medium
                  ${done
                    ? 'bg-orange-500 hover:bg-orange-400 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                {done ? 'Download Ready' : 'Please wait…'}
              </button>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
