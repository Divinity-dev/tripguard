"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Heading2,
  Undo2,
  Redo2,
  Send,
  Users,
  UserRound,
  Hotel,
  Mail,
  Loader2,
} from "lucide-react";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";

import AdminSidebar from "@/component/admin/AdminSidebar";
import AdminNavbar from "@/component/admin/AdminNavbar";
import AdminPageHeader from "@/component/admin/AdminPageHeader";
import ProtectedRoute from "../../../component/ProtectedRoute";

const audiences = [
  {
    value: "owners",
    label: "Accommodation Owners",
    description: "Send to users registered as accommodation owners.",
    icon: Hotel,
  },
  {
    value: "travellers",
    label: "Travellers",
    description: "Send to users registered as travellers.",
    icon: UserRound,
  },
  {
    value: "everyone",
    label: "Everyone",
    description: "Send to all active TripGuard users.",
    icon: Users,
  },
];

const EmailUsersPage = () => {
  const [audience, setAudience] = useState("everyone");
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-4 outline-none text-sm leading-7 text-gray-700",
      },
    },
    onUpdate: ({ editor }) => {
      setMessage(editor.getHTML());
    },
  });

  const handleSetLink = () => {
    if (!editor) return;

    const previousUrl =
      editor.getAttributes("link").href || "";

    const url = window.prompt(
      "Enter URL",
      previousUrl
    );

    if (url === null) return;

    if (url === "") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const handleSendEmail = async (event) => {
    event.preventDefault();

    setError("");

    if (!audience) {
      setError("Please select an audience.");
      return;
    }

    if (!subject.trim()) {
      setError("Please enter an email subject.");
      return;
    }

    if (!editor || editor.isEmpty) {
      setError("Please enter a message.");
      return;
    }

    /*
     * Backend endpoint will be connected here later.
     *
     * For now, we simply prevent the request from being sent.
     */

    setSending(true);

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      console.log({
        audience,
        subject,
        message,
      });

      alert(
        "Email form is ready. We will connect the sending endpoint next."
      );
    } catch (error) {
      console.error("Send email error:", error);

      setError(
        "Unable to send email. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const selectedAudience = audiences.find(
    (item) => item.value === audience
  );

  return (
    <ProtectedRoute allowedRole="admin">
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />

        <div className="lg:ml-72">
          <AdminNavbar />

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">

              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <AdminPageHeader
                  title="Send Email"
                  description="Send an email to TripGuard users based on their account type."
                />

                <Link
                  href="/admin"
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
                >
                  <ArrowLeft size={14} />
                  Back to dashboard
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSendEmail}
                className="space-y-6"
              >

                {/* Audience */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#63E6BE]/10 text-[#159669]">
                      <Users size={18} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Choose audience
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Select who should receive this email.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {audiences.map((item) => {
                      const Icon = item.icon;
                      const selected =
                        audience === item.value;

                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() =>
                            setAudience(item.value)
                          }
                          className={`rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-[#63E6BE] bg-[#63E6BE]/5 ring-1 ring-[#63E6BE]"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                selected
                                  ? "bg-[#63E6BE]/15 text-[#159669]"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <Icon size={16} />
                            </div>

                            <div
                              className={`h-4 w-4 rounded-full border ${
                                selected
                                  ? "border-[#159669] bg-[#159669]"
                                  : "border-gray-300"
                              }`}
                            >
                              {selected && (
                                <div className="m-[3px] h-1.5 w-1.5 rounded-full bg-white" />
                              )}
                            </div>
                          </div>

                          <h3 className="mt-4 text-sm font-semibold text-gray-800">
                            {item.label}
                          </h3>

                          <p className="mt-1 text-[11px] leading-5 text-gray-400">
                            {item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {selectedAudience && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
                      <Mail
                        size={14}
                        className="text-[#159669]"
                      />

                      <span>
                        Your email will be sent to{" "}
                        <strong className="text-gray-700">
                          {selectedAudience.label}
                        </strong>
                        .
                      </span>
                    </div>
                  )}
                </section>

                {/* Email details */}
                <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Mail size={18} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Email content
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        Compose the message you want your users to receive.
                      </p>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mt-6">
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-xs font-semibold text-gray-700"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(event) =>
                        setSubject(event.target.value)
                      }
                      placeholder="Enter email subject..."
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#63E6BE] focus:bg-white focus:ring-2 focus:ring-[#63E6BE]/10"
                    />
                  </div>

                  {/* Rich text editor */}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                      Message
                    </label>

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-[#63E6BE] focus-within:ring-2 focus-within:ring-[#63E6BE]/10">

                      {/* Toolbar */}
                      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50 p-2">

                        <EditorButton
                          title="Bold"
                          active={editor?.isActive("bold")}
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleBold()
                              .run()
                          }
                        >
                          <Bold size={15} />
                        </EditorButton>

                        <EditorButton
                          title="Italic"
                          active={editor?.isActive("italic")}
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleItalic()
                              .run()
                          }
                        >
                          <Italic size={15} />
                        </EditorButton>

                        <EditorButton
                          title="Underline"
                          active={editor?.isActive("underline")}
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleUnderline()
                              .run()
                          }
                        >
                          <Underline size={15} />
                        </EditorButton>

                        <ToolbarDivider />

                        <EditorButton
                          title="Heading"
                          active={editor?.isActive("heading", {
                            level: 2,
                          })}
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleHeading({
                                level: 2,
                              })
                              .run()
                          }
                        >
                          <Heading2 size={15} />
                        </EditorButton>

                        <EditorButton
                          title="Bullet list"
                          active={editor?.isActive("bulletList")}
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleBulletList()
                              .run()
                          }
                        >
                          <List size={16} />
                        </EditorButton>

                        <EditorButton
                          title="Numbered list"
                          active={editor?.isActive("orderedList")}
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .toggleOrderedList()
                              .run()
                          }
                        >
                          <ListOrdered size={16} />
                        </EditorButton>

                        <EditorButton
                          title="Add link"
                          active={editor?.isActive("link")}
                          onClick={handleSetLink}
                        >
                          <LinkIcon size={15} />
                        </EditorButton>

                        <ToolbarDivider />

                        <EditorButton
                          title="Undo"
                          disabled={
                            !editor?.can().undo()
                          }
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .undo()
                              .run()
                          }
                        >
                          <Undo2 size={15} />
                        </EditorButton>

                        <EditorButton
                          title="Redo"
                          disabled={
                            !editor?.can().redo()
                          }
                          onClick={() =>
                            editor
                              ?.chain()
                              .focus()
                              .redo()
                              .run()
                          }
                        >
                          <Redo2 size={15} />
                        </EditorButton>
                      </div>

                      <EditorContent editor={editor} />
                    </div>

                    <p className="mt-2 text-[10px] text-gray-400">
                      Use the toolbar above to format your email.
                    </p>
                  </div>
                </section>

                {/* Send */}
                <section className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Ready to send?
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Review your audience, subject and message before sending.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#173C37] px-6 py-3 text-xs font-semibold text-white transition hover:bg-[#102e2a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? (
                      <>
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Send Email
                      </>
                    )}
                  </button>
                </section>

              </form>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const EditorButton = ({
  children,
  title,
  onClick,
  active = false,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        active
          ? "bg-[#63E6BE]/20 text-[#159669]"
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-800"
      } ${
        disabled
          ? "cursor-not-allowed opacity-30"
          : ""
      }`}
    >
      {children}
    </button>
  );
};

const ToolbarDivider = () => (
  <div className="mx-1 h-5 w-px bg-gray-200" />
);

export default EmailUsersPage;