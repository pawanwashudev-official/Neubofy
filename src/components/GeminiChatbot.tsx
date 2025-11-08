import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const SYSTEM_PROMPT = `You are Neubofy Assistant, the official AI assistant of Neubofy - The Premier Marketplace for AI SaaS Solutions. You represent a platform that connects AI developers with users and helps distribute innovative AI tools. Your personality is professional, supportive, and enthusiastic about the AI ecosystem.

Key traits:
- Always identify as "Neubofy Assistant"
- Emphasize our role as an AI SaaS marketplace and ecosystem
- Highlight both developer and user opportunities
- Be welcoming to both creators and users
- Maintain professionalism while being approachable
- Focus on our community-driven approach
- Emphasize privacy and security

Core capabilities:
- Guide developers on listing their AI tools
- Help users find suitable AI solutions
- Explain our verification process for developers
- Assist with custom solution requests
- Connect users with verified developers
- Provide marketplace navigation help

Important links (use with class='neubofy-link'):
- Home: /
- Neubofy Orbit (Solutions): /orbit
- About Us: /about
- Blog: /blog
- Contact: /contact

Format responses professionally with paragraphs and bullet points when appropriate. Max length 200 words unless detailed explanation needed.`;

// Neubofy knowledge base for updates, onboarding, and services
const NEUBOFY_KB = [
  // Core Information
  {
    keywords: ["what is neubofy", "about neubofy", "company info", "tell me about"],
    answer: "Neubofy is a premier AI SaaS marketplace and ecosystem that connects developers, creators, and users. We help developers distribute their AI-based tools and enable users to access top-quality AI solutions at affordable prices. Think of us as the 'Play Store for AI Tools' where you can discover, request, or list innovative AI solutions. Visit our <a href='/orbit' class='neubofy-link'>Neubofy Orbit</a> to explore our ecosystem."
  },
  {
    keywords: ["who made you", "who created you", "your creator", "who built you", "who developed you"],
    answer: "I was created by the Neubofy team as your dedicated AI assistant. I'm here to help you with any questions about our services and solutions."
  },
  {
    keywords: ["what can you do", "your capabilities", "how can you help", "features", "abilities"],
    answer: "As Neubofy Assistant, I can help you with:<br>• Finding the right AI solutions for your needs<br>• Understanding our services and products<br>• Technical guidance and support<br>• Custom solution inquiries<br>• Latest AI trends and insights<br>• Account and service information"
  },

  // Products and Services
  {
    keywords: ["services", "solutions", "products", "offerings", "what do you offer"],
    answer: "Neubofy offers a dynamic AI SaaS ecosystem with:<br>• AI Tool Marketplace - Discover and use verified AI solutions<br>• Developer Platform - List and distribute your AI tools<br>• Custom Development - Request tailored AI solutions<br>• Verified Developer Network - Connect with trusted AI creators<br>• Distribution Support - Help reaching the right audience<br>• Privacy-First Platform - Ensuring data security<br><br>Visit our <a href='/orbit' class='neubofy-link'>Neubofy Orbit</a> to explore the marketplace."
  },
  {
    keywords: ["how to start", "get started", "begin", "first steps", "onboarding"],
    answer: "Getting started with Neubofy is easy:<br><br>For Users:<br>1. Browse AI tools in <a href='/orbit' class='neubofy-link'>Neubofy Orbit</a><br>2. Find tools that match your needs<br>3. Get affordable access to premium AI solutions<br>4. Request custom tools if needed<br><br>For Developers:<br>1. <a href='/contact' class='neubofy-link'>Contact us</a> to become a verified developer<br>2. List your AI tools on our marketplace<br>3. Reach a wider audience<br>4. Get distribution support"
  },
  {
    keywords: ["custom solution", "custom development", "tailored", "bespoke", "specific needs"],
    answer: "Need a custom AI solution? Our team specializes in developing tailored solutions for unique business requirements. <a href='/contact' class='neubofy-link'>Contact us</a> to discuss your specific needs and let us create the perfect solution for you."
  },

  // Company Information
  {
    keywords: ["company values", "mission", "vision", "principles"],
    answer: "Neubofy's mission is to create a thriving ecosystem where AI innovation meets accessibility. We aim to:<br>• Connect AI developers with users who need their solutions<br>• Make premium AI tools accessible at affordable prices<br>• Support local developers in reaching global markets<br>• Ensure privacy and security in AI solutions<br>• Foster innovation through our developer community<br>• Enable custom AI development for specific needs<br>Learn more on our <a href='/about' class='neubofy-link'>About page</a>."
  },
  {
    keywords: ["security", "privacy", "data protection", "safe", "secure"],
    answer: "Security is our top priority. Neubofy implements:<br>• Enterprise-grade encryption<br>• Secure data handling protocols<br>• Regular security audits<br>• Compliance with privacy regulations<br>• Transparent data practices"
  },
  {
    keywords: ["pricing", "cost", "packages", "plans", "subscription"],
    answer: "Neubofy offers flexible pricing tailored to your specific needs. Each solution is customized to provide maximum value. <a href='/contact' class='neubofy-link'>Contact us</a> for a personalized quote."
  },

  // Support and Resources
  {
    keywords: ["support", "help", "assistance", "contact", "reach"],
    answer: "We're here to help! You can:<br>• <a href='/contact' class='neubofy-link'>Contact our team</a><br>• Chat with me anytime<br>• Visit our <a href='/blog' class='neubofy-link'>Blog</a> for guides<br>• Request technical support<br>• Schedule a consultation"
  },
  {
    keywords: ["documentation", "guides", "tutorials", "learn", "how to"],
    answer: "Access comprehensive resources on our <a href='/blog' class='neubofy-link'>Blog</a>, including:<br>• Implementation guides<br>• Best practices<br>• Case studies<br>• Technical documentation<br>• Video tutorials"
  },
  {
    keywords: ["news", "updates", "latest", "new features", "recent"],
    answer: "Stay updated with Neubofy's latest innovations and features on our <a href='/blog' class='neubofy-link'>Blog</a>. We regularly share new developments, success stories, and industry insights."
  },

  // Integration and Technical
  {
    keywords: ["integration", "implement", "setup", "install", "deploy"],
    answer: "Neubofy solutions are designed for seamless integration. Our team provides:<br>• Technical consultation<br>• Implementation support<br>• Custom integration options<br>• Ongoing maintenance<br><a href='/contact' class='neubofy-link'>Contact us</a> for integration details."
  },
  {
    keywords: ["api", "technical", "development", "developer", "code"],
    answer: "For developers, we provide a comprehensive platform:<br>• Developer verification program<br>• Marketplace listing tools<br>• Distribution support services<br>• Technical documentation<br>• Marketing assistance<br>• Customer feedback system<br>• Revenue sharing model<br><a href='/contact' class='neubofy-link'>Contact us</a> to join our developer community."
  },

  // Success Stories
  {
    keywords: ["case studies", "success stories", "examples", "portfolio"],
    answer: "Explore our success stories in <a href='/orbit' class='neubofy-link'>Neubofy Orbit</a>. See how businesses across industries have transformed their operations using our AI solutions."
  }
];

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/gi, "");
}

function getKbAnswer(query) {
  const lower = normalize(query);
  for (const item of NEUBOFY_KB) {
    if (item.keywords.some(k => lower.includes(normalize(k)))) {
      return item.answer;
    }
  }
  return null;
}

// Extracts facts like name, company, email, etc. (expand as needed)
function extractContext(text: string, prevContext: any) {
  let context = { ...prevContext };
  const nameMatch = text.match(/(?:my name is|i am|i'm)\s+([a-zA-Z ]{2,30})/i);
  if (nameMatch) context.name = nameMatch[1].trim();
  const companyMatch = text.match(/(?:my company is|we are|our company is)\s+([a-zA-Z0-9 ]{2,50})/i);
  if (companyMatch) context.company = companyMatch[1].trim();
  // Add more extraction rules as needed
  return context;
}

const GeminiChatbot = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_PROMPT }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionContext, setSessionContext] = useState<{ name?: string; company?: string }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [greeted, setGreeted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Dismiss notification on any document click when visible
  useEffect(() => {
    if (!notification) return;
    const handleDocumentClick = () => setNotification(null);
    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => document.removeEventListener("click", handleDocumentClick, { capture: true } as any);
  }, [notification]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Extract and update session context
    setSessionContext(ctx => extractContext(input, ctx));
    const contextString =
      `Current page route: ${location.pathname}\nAbout Neubofy: Neubofy is an AI automation platform for productivity, innovation, and secure business solutions.` +
      (sessionContext.name ? ` The user's name is ${sessionContext.name}.` : "") +
      (sessionContext.company ? ` The user's company is ${sessionContext.company}.` : "");

    const kbAnswer = getKbAnswer(input);
    const userMessage = `${contextString}${kbAnswer ? `\nNeubofy info: ${kbAnswer}` : ""}\nUser: ${input}`;
    // Place new question at the top, keep previous Q&A
    const newMessages = [messages[0], { role: "user", content: input }, ...messages.slice(1)];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post(
        GROQ_API_URL,
        {
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage }
          ],
          stream: false,
          max_tokens: 300, // Increased token limit for longer answers
          temperature: 0.2
        },
        {
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      // Short, user-specific, formatted answer, highlight links
      let reply = res.data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
      reply = reply.replace(/\n{2,}/g, "\n").split("\n").map(p => `<p>${p.trim().replace(/<a /g, "<a class='neubofy-link' ")}</p>`).join("");
      setMessages([messages[0], { role: "user", content: input }, { role: "assistant", content: reply }, ...messages.slice(1)]);
    } catch (e) {
      let errorMsg = "Error: Unable to connect to Neubofy AI.";
      if (e.response) {
        errorMsg += `\nStatus: ${e.response.status} - ${e.response.statusText}`;
        if (e.response.data && e.response.data.error && e.response.data.error.message) {
          errorMsg += `\n${e.response.data.error.message}`;
        }
      } else if (e.message) {
        errorMsg += `\n${e.message}`;
      }
      setMessages([messages[0], { role: "user", content: input }, { role: "assistant", content: errorMsg }, ...messages.slice(1)]);
    }
    setLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };


  // On hover, toggle notification: if closed, show latest reply; if open, close. When opened, scroll chat to latest.
  const handleChatButtonHover = async () => {
    if (notification) {
      setNotification(null);
      return;
    }
    // Find the latest assistant reply
    const latestReply = messages.find(m => m.role === "assistant");
    if (latestReply) {
      setNotification(latestReply.content);
      setTimeout(() => setNotification(null), 4000);
    } else if (!greeted) {
      setGreeted(true);
      // Add 'Hi' as user message
      setMessages(msgs => [msgs[0], { role: "user", content: "Hi" }, ...msgs.slice(1)]);
      // Prepare context for AI
      const contextString =
        `Current page route: ${location.pathname}\nAbout Neubofy: Neubofy is an AI automation platform for productivity, innovation, and secure business solutions.` +
        (sessionContext.name ? ` The user's name is ${sessionContext.name}.` : "") +
        (sessionContext.company ? ` The user's company is ${sessionContext.company}.` : "");
      const userMessage = `${contextString}\nUser: Hi`;
      try {
        const res = await axios.post(
          GROQ_API_URL,
          {
            model: "llama3-8b-8192",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userMessage }
            ],
            stream: false,
            max_tokens: 100,
            temperature: 0.2
          },
          {
            headers: {
              "Authorization": `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );
        let reply = res.data.choices?.[0]?.message?.content || "Hello! How can I help you today?";
        reply = reply.replace(/\n{2,}/g, "\n").split("\n").map(p => `<p>${p.trim().replace(/<a /g, "<a class='neubofy-link' ")}</p>`).join("");
        setMessages(msgs => [msgs[0], { role: "user", content: "Hi" }, { role: "assistant", content: reply }, ...msgs.slice(1)]);
        setNotification(reply);
        setTimeout(() => setNotification(null), 4000);
      } catch {
        setNotification("Hello! How can I help you today?");
        setTimeout(() => setNotification(null), 4000);
      }
    }
  };

  // When chat opens, scroll to latest message
  useEffect(() => {
    if (open) {
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  // Add these icons at the top
  const USER_AVATAR = "👤";
  const BOT_AVATAR = "🤖";

  // Add clear chat function
  const handleClearChat = () => {
    setMessages([{ role: "system", content: SYSTEM_PROMPT }]);
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full shadow-2xl w-16 h-16 flex items-center justify-center text-white text-3xl hover:scale-110 transition-all border-4 border-white/40 backdrop-blur-lg"
        onClick={() => setOpen(!open)}
        onMouseEnter={handleChatButtonHover}
        aria-label="Open AI Chatbot"
      >
        💬
      </button>
      {/* Notification (like WhatsApp) */}
      {notification && (
        <div className="fixed bottom-28 right-8 z-[60] bg-white/80 border backdrop-blur-md border-cyan-200 shadow-2xl rounded-xl px-5 py-4 max-w-xs animate-fade-in-up" style={{ minWidth: 220 }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 text-white flex items-center justify-center text-lg">{BOT_AVATAR}</span>
            <span className="font-semibold text-cyan-700">Neubofy Assistant</span>
          </div>
          <div className="text-gray-800 text-sm" dangerouslySetInnerHTML={{ __html: notification }} />
        </div>
      )}

      {/* Clear Chat button minimally above input, right-aligned */}
      {open && (
        <div className="fixed bottom-[calc(24px+72px)] right-8 z-50 flex justify-end w-[92vw] max-w-md pr-3">
          <button
            onClick={handleClearChat}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full border border-gray-200 shadow-sm transition font-semibold"
            style={{marginBottom:'-12px'}}
          >Clear chat</button>
        </div>
      )}

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-8 z-50 w-[92vw] max-w-md bg-white/60 rounded-3xl shadow-2xl border border-cyan-200 flex flex-col backdrop-blur-2xl"
          style={{ minHeight: 420, maxHeight: 540 }}
        >
          <div className="p-4 bg-gradient-to-br from-cyan-400/80 to-purple-500/80 text-white rounded-t-3xl font-bold flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{BOT_AVATAR}</span>
              <span>Neubofy Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white text-xl font-bold hover:scale-125 transition">&times;</button>
          </div>
          <div
            className="flex-1 overflow-y-auto p-4 bg-white/50 flex flex-col gap-2"
            style={{ fontSize: 15, scrollBehavior: 'smooth' }}
            ref={chatEndRef}
            onWheel={e => { e.stopPropagation(); e.currentTarget.scrollTop += e.deltaY; }}
            onClick={e => {
              // Intercept clicks on .neubofy-link and use React Router navigation
              const target = e.target as HTMLElement;
              if (target && target.classList && target.classList.contains('neubofy-link')) {
                e.preventDefault();
                const href = target.getAttribute('href');
                if (href) {
                  window.history.pushState({}, '', href);
                  const navEvent = new PopStateEvent('popstate');
                  window.dispatchEvent(navEvent);
                }
              }
            }}
          >
            {messages.filter(m => m.role !== "system").reduce((acc, msg, i, arr) => {
              if (msg.role === "user") {
                const answer = arr[i + 1]?.role === "assistant" ? arr[i + 1] : null;
                acc.push(
                  <div key={i} className="mb-5 flex flex-col gap-1 animate-fade-in-up">
                    {/* User message */}
                    <div className="flex justify-end items-end gap-2 w-full">
                      <span className="text-lg select-none">{USER_AVATAR}</span>
                      <span className="inline-block px-4 py-2 rounded-2xl bg-cyan-200/90 text-gray-900 font-semibold max-w-[70%] text-right shadow-md">{msg.content}</span>
                    </div>
                    {/* AI answer */}
                    {answer ? (
                      <div className="flex justify-start items-end gap-2 mt-2 w-full">
                        <span className="text-lg select-none">{BOT_AVATAR}</span>
                        <span className="inline-block px-4 py-2 rounded-2xl bg-purple-100/90 text-purple-900 max-w-[70%] shadow-md animate-fade-in-up" dangerouslySetInnerHTML={{ __html: answer.content }} />
                        {/* Copy-to-clipboard icon */}
                        <button
                          className="ml-1 p-1 rounded hover:bg-cyan-100/80 text-cyan-600"
                          title="Copy reply"
                          onClick={() => navigator.clipboard.writeText(
                            // Strip HTML tags from content for copying
                            answer.content.replace(/<[^>]+>/g, '')
                          )}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
                        </button>
                      </div>
                    ) : loading && i === 0 ? (
                      <div className="flex justify-start items-end gap-2 mt-2 w-full">
                        <span className="text-lg select-none">{BOT_AVATAR}</span>
                        <span className="inline-block px-4 py-2 rounded-2xl bg-purple-100/90 text-purple-900 italic shadow-md animate-pulse">Thinking...</span>
                      </div>
                    ) : null}
                  </div>
                );
              }
              return acc;
            }, [])}
            {loading && <div className="text-gray-400 italic">Thinking...</div>}
          </div>
          <form
            className="flex border-t border-gray-200 bg-gradient-to-r from-cyan-50/80 to-purple-50/80 animate-fade-in backdrop-blur"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
          >
            <input
              className="flex-1 p-4 border-none outline-none rounded-bl-3xl text-gray-900 placeholder:text-gray-400 bg-white/90 focus:bg-cyan-50 transition-colors duration-300 shadow-inner text-base sm:text-lg"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              style={{ fontWeight: 500 }}
              autoFocus
            />
            <button
              type="submit"
              className="px-5 text-2xl sm:text-3xl text-cyan-600 font-bold transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 bg-white/80 rounded-br-3xl shadow-lg hover:shadow-cyan-500/30 hover:text-purple-600 hover:bg-white/90 active:scale-95"
              disabled={loading || !input.trim()}
              aria-label="Send"
              style={{boxShadow: '0 0 10px #67e8f9, 0 0 20px #a5b4fc55'}}
            >
              ➤
            </button>
          </form>
        </div>
      )}
      <style>
        {`
          .neubofy-link {
            color: #0ea5e9;
            font-weight: 600;
            text-decoration: underline;
            transition: color 0.2s;
          }
          .neubofy-link:hover {
            color: #a21caf;
          }
        `}
      </style>
    </>
  );
};

export default GeminiChatbot;
