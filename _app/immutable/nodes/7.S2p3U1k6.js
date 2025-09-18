import{c as a,a as i}from"../chunks/ctwvuS-Z.js";import"../chunks/kU77dIpV.js";var o=a(`<div class="prose max-w-none w-full mx-auto mt-6 lg:pr-4 svelte-1gtsq86"><div class="border-y lg:border-t-0 border-gray-300 dark:border-gray-700 p-6 h-37 relative"><h2 class="font-serif font-medium lg:h-4 justify-end flex-col block mt-16 dark:text-gray-400">Ironfell — software for science authorship</h2> <div class="absolute size-2 z-10 rounded-[1px] rotate-45 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 left-[-4.5px] bottom-[-4.5px]"></div></div> <div class="font-serif font-medium p-7 px-8 dark:text-gray-400 border-y border-t-0 border-gray-300 dark:border-gray-700"><p>Below are some questions and answers about my work on a software tool for science publishing
			and communication, as of May 2025. The software is under active development <a href="https://github.com/sansseriff/Ironfell">here</a>.</p> <h4 class="dark:text-gray-400">Describe the problem your are focusd on and your proposed solution or direction for
			identifying a solution. Aim for a level of explanation that a smart college freshman could
			understand.</h4> <p>Scientific discourse is ill-equipped for today's attention economy. Countless valuable papers
			and presentations never reach those who would benefit most, as information is reduced to
			buzzwords and sound bites. Scientists compete for limited attention through a system rewarding
			'high impact' publications in for-profit journals. But the available attention and interest in
			science isn't fixed. It's highly elastic, as demonstrated by successful science communicators
			who attract millions of eager learners. Impactful STEM communication thrives on YouTube [1]
			partly because multimedia offers high information bandwidth. To evolve, science communication
			must break free from static PDFs and PowerPoint presentations to embrace multimedia.</p> <p>I propose software for authoring scientific content—ideal for creating animated diagrams and
			explanations, but also capable of compiling static webpages. This tool draws inspiration from
			libraries like manim & motion-canvas [2,3] by using a text-based schema to generate and
			animate visuals. Unlike those tools it provides an interactive user interface that eliminates
			the need to write code.</p> <p>While software alone cannot replace the rhetoric of great science communicators, modern AI
			dramatically changes technical content accessibility. LLMs transform jargon-heavy text into
			more equitable formats customized for specific individuals or groups (just preface a paper fed
			into ChatGPT with 'explain like I'm in high school'). Though far from perfect, this ability
			justifies a fundamental rethinking of how technical content is created and consumed.</p> <p>If AI is to enable a future "front-end" for technical learning [4], it must generate accurate
			visuals/animations and draw from trustable scientific literature. My proposed solution
			addresses these challenges through:</p> <ol class="list-decimal list-inside"><li>An iterative creation process combining AI suggestions with human feedback: users sketch or
				describe a figure, AI converts it into animatable vector entities, the user refines these
				entities (thereby editing the underlying text schema) and programs animations through visual
				edits or written instructions. This pattern has a clear path towards quality and scale,
				unlike initial attempts to generate animations with AI [5].</li> <li>Creation of reusable web-first visual and computational assets—diagrams of scientific
				concepts and abstract entities—along with discourse-graph entities that convey natural
				language ideas [6]. Academic papers are abstracted into graph-like data structures stored on
				open servers.</li></ol> <p>I'm building this tool using a browser-based game engine to blur boundaries between output
			formats (text, visual, audio). The same engine enables content creation and consumption, as
			the underlying schema format driving the engine will be trained on, retrieved, and generated
			by AI models.</p> <ol class="list-decimal list-inside"><li>[1] 1Blue1Brown, Physics Girl, Welch Labs, etc</li> <li>[2] <a href="https://dub.sh/bC8gyYO">https://dub.sh/bC8gyYO</a></li> <li>[3] <a href="https://motioncanvas.io/">https://motioncanvas.io/</a></li> <li>[4] <a href="https://dub.sh/EJZRocZ">https://dub.sh/EJZRocZ</a></li> <li>[5] <a href="https://dub.sh/oka8Omp">https://dub.sh/oka8Omp</a></li> <li>[6] <a href="https://dub.sh/vJHQJwD">https://dub.sh/vJHQJwD</a></li></ol></div> <div class="font-serif font-medium p-7 px-8 dark:text-gray-400 border-y border-t-0 border-gray-300 dark:border-gray-700"><h4 class="dark:text-gray-400">What assumptions about the future of science and technology are baked into your proposal? What
			are the ways in which those assumptions are most likely to be wrong?</h4> <p>I believe AI will increasingly serve as a front-end for learning and entertainment, with
			improvements to retrieval augmentation methods, alongside AI's expanding content generation
			abilities.</p> <p>My proposal assumes agentic AI systems have tremendous room to grow when operating inside game
			engines—environments that function as world models across various levels of abstraction.</p> <p>Most critically—and perhaps most questionably—I assume the entrenched academic publishing
			system can pivot toward more equitable, open, and advanced authoring formats. I question if a
			massive increase in information bandwidth and quality is enough to drive change. I worry that
			for-profit publishers will continue to effectively leverage a business model that relies on
			the staying power of their brand and artificial scarcity, analogous to how diamond retailers
			like Tiffany & Co. extract large profit margins while synthetic diamond suppliers produce
			equivalent products at lower prices.</p></div> <div class="font-serif font-medium p-7 px-8 dark:text-gray-400 border-y border-t-0 border-gray-300 dark:border-gray-700"><h4 class="dark:text-gray-400">Why did you pick this problem to work on? What’s novel about it?</h4> <p>Technology repeatedly disrupts the creation of media by reducing costs of certain information
			forms to near-zero. The invention of photography punctuated the end of Academic Realism
			painting, radio/phonographs disrupted live music markets, and television similarly impacted
			theater and opera.</p> <p>AI tools now make superficially rigorous text nearly costless [1,2], creating a curation
			crisis in academic discourse, exacerbated by closed, for-profit publishing models. As
			AI-generated slop proliferates, demand shifts toward higher-bandwidth and more sophisticated
			content forms that teach and demonstrate research integrity more effectively.</p> <p>We need to guide the move away from static PDFs in favor of new abstract synthesis formats
			that enable multimedia learning. No consensus exists yet on the specifics of that future
			format. I want to develop a solution and demonstrate its benefits to my fellow academics, in
			time to avoid the highest societal costs of the current publishing system.</p> <ol class="list-decimal list-inside"><li>[1] <a href="https://dub.sh/8PpT6KY">https://dub.sh/8PpT6KY</a></li> <li>[2] <a href="https://dub.sh/xctdVM2">https://dub.sh/xctdVM2</a></li></ol></div> <div class="font-serif font-medium p-7 px-8 dark:text-gray-400 border-y border-t-0 border-gray-300 dark:border-gray-700"><h4 class="dark:text-gray-400">How long have you been thinking about this problem? How much progress have you made on it?</h4> <p>I had a series of mental breakthroughs during the COVID lockdowns. From there, it took about a
			year and hundreds of notes to realize I wanted to build a specific tool. I've spent a many
			months researching what libraries and frameworks to build with.</p> <p>I recognized modern software needed web presence, so I learned full stack development and
			co-opted it for my PhD research. Finding HTML inadequate for complex graphics, I explored
			GPU-accelerated browser renderers.</p> <p>I initially lost time attempting to build a render engine from scratch before pivoting to
			higher-level libraries. My most relevant progress is Compass, an AI-driven diagram builder
			presented at Force11 2024 [1], built with typescript and a library called Motion Canvas:</p> <div class="video-container my-6 svelte-1gtsq86"><iframe src="https://www.youtube.com/embed/41owusgOsOU?si=sr2YMaKwnuXSnCcV" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" class="svelte-1gtsq86"></iframe></div> <p>Currently, I'm using the Rust-based Bevy game engine [2] (compiled to web assembly) and am
			close to enabling LLM control of it via json-RPC commands. Major UI development comes next.</p> <ol class="list-none list-inside"><li>[1] <a href="https://dub.sh/cxM4xj5">Force 11 Conference Presentation</a></li> <li>[2] <a href="https://bevyengine.org/">Bevy Game Engine</a></li></ol></div> <div class="font-serif font-medium p-7 px-8 dark:text-gray-400 border-y border-t-0 border-gray-300 dark:border-gray-700"><h4 class="dark:text-gray-400">What gets you out of bed in the morning?</h4> <p>I'm so lucky to work on interesting science. Despite occasional issues with publishing and
			funding, it's worth it.</p> <p>You can find a myriad of quotes from scientists remarking on the 'beauty' of their particular
			theory or work. Larger than that, I would say the scientific process is unusually monomythic
			relative to other career paths in modern times. It affords scientists a surprising amount of
			agency to follow their desires, learn, and make impactful choices — paralleling a
			narratological hero's journey [1].</p> <p>We're most familiar with the hero's journey from story telling. From that context, it seems so
			peculiar that those of us in modern society experiencing meaningful scientific stories are
			barely sharing them in a way that expresses their inherent elegance, complexity, and meaning.</p> <p>Watch this video (not my work), and imagine instead of letters and shapes it's animated
			diagrams, graphs, and figures. A highlight-reel montage of the worlds best stories.</p> <div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/118919656?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="FITC Tokyo 2015 Titles"></iframe></div> <script src="https://player.vimeo.com/api/player.js"><\/script> <ol class="list-none list-inside"><li>[1] <a href="https://en.wikipedia.org/wiki/Hero%27s_journey">The Hero's Journey</a></li></ol></div></div>`);function n(e){var t=o();i(e,t)}export{n as component};
