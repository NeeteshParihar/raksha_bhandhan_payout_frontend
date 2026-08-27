import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Plus, RotateCcw, Trash2 } from "lucide-react";
import type { IQuiz } from "../../services/quiz";

interface QuizCardProps {
  quiz: IQuiz;
  userRole?: "BROTHER" | "SISTER";
  onAddQuestions?: (quiz: IQuiz) => void;
  onResetQuiz?: (quiz: IQuiz) => void;
  onSisterAction?: (quiz: IQuiz) => void;
  onDeleteQuiz?: (quiz: IQuiz) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  userRole = "BROTHER",
  onAddQuestions,
  onResetQuiz,
  onSisterAction,
  onDeleteQuiz,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    if (!onDeleteQuiz) return;
    setIsDeleting(true);
    try {
      await onDeleteQuiz(quiz);
      console.log("deleting the quiz");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between group">
      <div>
        <h3 className="text-lg font-bold text-gray-800">{quiz.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(quiz.status)}`}
          >
            {quiz.status.replace("_", " ")}
          </span>
          {quiz.totalAmount !== undefined && (
            <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
              Total: ₹{quiz.totalAmount}
            </span>
          )}
          {quiz.payoutStats && (
            <div className="flex gap-2 text-xs font-medium">
              <span
                className="text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200"
                title="Pending Payouts"
              >
                {quiz.payoutStats.pending} Pending
              </span>
              <span
                className="text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200"
                title="Successful Payouts"
              >
                {quiz.payoutStats.success} Success
              </span>
              <span
                className="text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200"
                title="Failed Payouts"
              >
                {quiz.payoutStats.failed} Failed
              </span>
            </div>
          )}
        </div>
      </div>

      {userRole === "BROTHER" ? (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
              {/* add questiion button */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  onAddQuestions?.(quiz);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
              >
                <Plus size={16} /> manage quiz
              </button>

              {/* reset quiz button */}
              <button
                onClick={() => {
                  setShowMenu(false);
                  onResetQuiz?.(quiz);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-2"
              >
                <RotateCcw size={16} /> Reset Quiz
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowDeleteConfirm(true);
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete Quiz
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => onSisterAction?.(quiz)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
            quiz.status === "PENDING"
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
              : quiz.status === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {quiz.status === "PENDING"
            ? "Start"
            : quiz.status === "IN_PROGRESS"
              ? "Continue"
              : "Review"}
        </button>
      )}

      {showDeleteConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Quiz?
              </h2>
              <p className="text-gray-500 text-center mb-8">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-700">"{quiz.title}"</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-md shadow-red-200 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default QuizCard;
