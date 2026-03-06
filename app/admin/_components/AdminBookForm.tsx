// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { 
//   Save, Trash2, Plus, Book as BookIcon, Type, 
//   Layers, FileText, Image as ImageIcon, ArrowLeft, Loader2 
// } from "lucide-react";
// import Link from "next/link";

// interface Attachment { _id: string; type: "text" | "image"; value?: string; url?: string; }
// interface Chapter { title: string; content: string; }
// interface Book { _id: string; title: string; description: string; chapters?: Chapter[]; attachments?: Attachment[]; }

// export default function AdminBookForm({ book }: { book: Book }) {
//   const router = useRouter();
//   const [title, setTitle] = useState(book.title);
//   const [description, setDescription] = useState(book.description);
//   const [chapters, setChapters] = useState<Chapter[]>(book.chapters || []);
//   const [existingAttachments, setExistingAttachments] = useState<Attachment[]>(book.attachments || []);
//   const [newFiles, setNewFiles] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);

//   const BACKEND_URL = "http://localhost:3000";

//   const updateChapter = (idx: number, field: "title" | "content", value: string) => {
//     setChapters(prev => prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("chapters", JSON.stringify(chapters));
//       existingAttachments.forEach(att => formData.append("existingAttachments", att._id));
//       newFiles.forEach(f => formData.append("attachments", f));

//       const res = await fetch(`${BACKEND_URL}/api/v1/admin/books/${book._id}`, {
//         method: "PUT",
//         credentials: "include",
//         body: formData,
//       });

//       if (res.ok) {
//         router.push("/admin/books");
//         router.refresh();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto pb-20">
//       <Link href="/admin/books" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 group">
//         <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all"><ArrowLeft size={20}/></div>
//         <span className="font-bold">Back to Library</span>
//       </Link>

//       <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
//         <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-8 text-white">
//           <h1 className="text-3xl font-bold flex items-center gap-3"><BookIcon size={32}/> Edit Book Details</h1>
//           <p className="opacity-80 mt-1 font-medium">Manage your chapters, descriptions, and media attachments.</p>
//         </div>

//         <div className="p-8 space-y-10">
//           {/* Core Info */}
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><Type size={16} className="text-orange-500"/> Book Title</label>
//               <input 
//                 value={title} 
//                 onChange={e => setTitle(e.target.value)} 
//                 className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-5 py-4 text-gray-900 font-bold text-lg focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white outline-none transition-all"
//                 placeholder="Enter book title..."
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-gray-700 flex items-center gap-2"><FileText size={16} className="text-orange-500"/> Description</label>
//               <textarea 
//                 value={description} 
//                 onChange={e => setDescription(e.target.value)} 
//                 className="w-full border-2 border-gray-100 bg-gray-50/50 rounded-2xl px-5 py-4 text-gray-900 focus:ring-4 focus:ring-orange-100 focus:border-orange-400 focus:bg-white outline-none transition-all h-32 resize-none"
//                 placeholder="Write a brief summary of the book..."
//               />
//             </div>
//           </div>

//           {/* Chapters Section */}
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Layers size={20} className="text-orange-500"/> Book Chapters</h3>
//               <button 
//                 type="button" 
//                 onClick={() => setChapters([...chapters, { title: "", content: "" }])}
//                 className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-bold hover:bg-orange-200 transition-all flex items-center gap-2"
//               >
//                 <Plus size={18}/> Add Chapter
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               {chapters.map((ch, idx) => (
//                 <div key={idx} className="bg-orange-50/30 border-2 border-orange-100 rounded-2xl p-6 relative group animate-fade-in">
//                   <div className="absolute -left-3 top-6 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
//                     {idx + 1}
//                   </div>
//                   <div className="space-y-3">
//                     <input
//                       placeholder="Chapter Title"
//                       value={ch.title}
//                       onChange={e => updateChapter(idx, "title", e.target.value)}
//                       className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2 font-bold text-gray-900 focus:ring-2 focus:ring-orange-400 outline-none transition-all"
//                     />
//                     <textarea
//                       placeholder="Start writing chapter content..."
//                       value={ch.content}
//                       onChange={e => updateChapter(idx, "content", e.target.value)}
//                       className="w-full bg-white border border-orange-200 rounded-xl px-4 py-2 text-gray-800 focus:ring-2 focus:ring-orange-400 outline-none transition-all h-32 resize-none"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setChapters(chapters.filter((_, i) => i !== idx))}
//                       className="text-rose-600 hover:text-rose-700 font-bold text-sm flex items-center gap-1 transition-colors"
//                     >
//                       <Trash2 size={14}/> Remove Chapter
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Attachments */}
//           <div className="space-y-4">
//             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><ImageIcon size={20} className="text-orange-500"/> Media & Files</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {existingAttachments.map((att, idx) => (
//                 <div key={att._id} className="relative group bg-gray-50 border-2 border-gray-100 rounded-2xl overflow-hidden p-2">
//                   {att.type === "image" ? (
//                     <img src={`${BACKEND_URL}${att.url}`} className="w-full h-32 object-cover rounded-xl" alt="" />
//                   ) : (
//                     <div className="h-32 flex items-center justify-center bg-white rounded-xl text-gray-400"><FileText size={32}/></div>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => setExistingAttachments(prev => prev.filter((_, i) => i !== idx))}
//                     className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
//                   >
//                     <Trash2 size={16}/>
//                   </button>
//                 </div>
//               ))}
//               <label className="border-2 border-dashed border-gray-200 rounded-2xl h-[148px] flex flex-col items-center justify-center text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-all cursor-pointer group">
//                 <div className="p-3 bg-gray-50 rounded-full group-hover:bg-orange-50 mb-2"><Plus size={24}/></div>
//                 <span className="text-sm font-bold">Upload File</span>
//                 <input type="file" multiple onChange={e => setNewFiles(Array.from(e.target.files || []))} className="hidden" />
//               </label>
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="pt-8 border-t border-gray-100 flex gap-4">
//             <button type="button" onClick={() => router.back()} className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Discard</button>
//             <button 
//               type="submit" 
//               disabled={loading} 
//               className="flex-<sup>2</sup> py-4 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
//             >
//               {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>}
//               {loading ? "Updating Book..." : "Save Book Changes"}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }