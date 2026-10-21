export const guideContent = String.raw`
<!-- Barre de progression de lecture -->
    <div class="fixed top-0 left-0 w-full h-1 z-50 bg-neutral-200 dark:bg-neutral-800 no-print">
        <div id="reading-progress" class="h-full bg-red-500"></div>
    </div>

    <!-- Header Compact -->
    <header class="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 no-print">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <a href="/fr/blog" class="font-semibold text-lg tracking-tight hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Retour au blog">
                    Vincent DESBROSSES
                </a>
                <span class="hidden sm:inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-medium rounded-full">
                    Blog
                </span>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-4">
                <button data-guide-print class="hidden md:flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors" aria-label="Enregistrer en PDF">
                    <i class="ph ph-printer text-lg"></i>
                    <span>PDF</span>
                </button>
                <button id="share-btn" class="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors" aria-label="Partager le lien">
                    <i class="ph ph-share-network text-lg"></i>
                </button>
                <div class="w-px h-5 bg-neutral-200 dark:bg-neutral-700"></div>
                <button id="theme-toggle" class="p-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors" aria-label="Changer de thème">
                    <i class="ph ph-moon text-lg dark:hidden"></i>
                    <i class="ph ph-sun text-lg hidden dark:block"></i>
                </button>
            </div>
        </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">
        
        <main class="w-full min-w-0">
            <article class="max-w-[700px] mx-auto">
                <nav aria-label="{{ARTICLE_BREADCRUMB_ARIA}}" class="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
                    <ol class="flex flex-wrap items-center gap-2">
                        <li><a class="underline-offset-4 hover:text-red-600 hover:underline dark:hover:text-red-400" href="{{ARTICLE_HOME_URL}}">Portfolio</a></li>
                        <li aria-hidden="true">/</li>
                        <li><a class="underline-offset-4 hover:text-red-600 hover:underline dark:hover:text-red-400" href="{{ARTICLE_BLOG_URL}}">Blog</a></li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" class="min-w-0 truncate text-neutral-700 dark:text-neutral-200"><span>{{ARTICLE_TITLE}}</span></li>
                    </ol>
                </nav>
                <details class="guide-toc mb-10 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                    <summary class="cursor-pointer px-5 py-4 font-semibold text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-600 dark:text-white">
                        Sommaire du guide
                    </summary>
                    <nav aria-label="Sommaire" class="border-t border-neutral-200 px-5 py-4 dark:border-neutral-800">
                <ul class="space-y-3 text-sm text-neutral-600 dark:text-neutral-400" id="toc-list">
                    <li><a href="#les-trois-piliers" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">01. Les trois piliers</a></li>
                    <li><a href="#developper-reseau" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">02. Développer son réseau</a></li>
                    <li><a href="#trouver-opportunites" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">03. Trouver des opportunités</a></li>
                    <li><a href="#creer-contenu" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">04. Créer du contenu</a></li>
                    <li><a href="#preparer-entretiens" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">05. Préparer ses entretiens</a></li>
                    <li><a href="#organiser-recherche" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">06. Organiser sa recherche</a></li>
                    <li><a href="#rencontrer-professionnels" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">07. Rencontrer des professionnels</a></li>
                    <li><a href="#dix-conseils" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">08. Dix conseils supplémentaires</a></li>
                    <li><a href="#erreurs-a-eviter" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">09. Les erreurs à éviter</a></li>
                    <li><a href="#checklist-finale" class="toc-link block pl-3 hover:text-neutral-900 dark:hover:text-white">10. Checklist finale</a></li>
                </ul>
                    </nav>
                </details>
                
                <!-- Hero Éditorial -->
                <header class="mb-16">
                    <div class="guide-category inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold uppercase tracking-wider mb-6">
                        <i class="ph-fill ph-book-open"></i>
                        {{ARTICLE_CATEGORY}} • Développement Web
                    </div>
                    
                    <h1 class="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight mb-6">
                        {{ARTICLE_TITLE}}
                    </h1>
                    
                    <p class="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
                        {{ARTICLE_EXCERPT}}
                    </p>

                    <div class="prose prose-zinc dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-400 mb-8">
                        <p>Trouver son premier emploi dans le développement ne repose pas uniquement sur ses compétences techniques. Il faut aussi savoir les démontrer, inspirer confiance et multiplier les occasions de rencontrer les bonnes personnes.</p>
                        <p>J'ai rassemblé ici les conseils que je partage régulièrement avec des développeurs juniors, avec une méthode concrète pour passer à l'action.</p>
                    </div>

                    <div class="flex items-center gap-4 mb-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                        <div class="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                            <!-- Placeholder pour la photo de l'auteur. Pas de fausse photo générée. -->
                            <div class="w-full h-full flex items-center justify-center text-neutral-700 dark:text-neutral-200 font-bold">VD</div>
                        </div>
                        <div>
                            <div class="font-medium text-neutral-900 dark:text-white">Vincent DESBROSSES</div>
                            <div class="text-sm text-neutral-500 dark:text-neutral-400">Développeur Fullstack</div>
                        </div>
                        <div class="ml-auto text-xs text-neutral-500 dark:text-neutral-400 text-right">
                            Publié le <time dateTime="{{ARTICLE_PUBLISHED_ISO}}">{{ARTICLE_PUBLISHED_AT}}</time><br>
                            <span class="{{ARTICLE_UPDATED_CLASS}}">Mis à jour le <time dateTime="{{ARTICLE_UPDATED_ISO}}">{{ARTICLE_UPDATED_AT}}</time><br></span>
                            {{ARTICLE_READING_TIME}} min de lecture
                        </div>
                    </div>

                    <div class="flex flex-wrap gap-4 no-print">
                        <a href="#les-trois-piliers" data-guide-start-reading class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-sm">
                            Commencer la lecture
                        </a>
                        <button data-guide-print class="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-base font-medium rounded-lg text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors shadow-sm">
                            <i class="ph ph-download-simple mr-2 text-lg"></i>
                            Enregistrer en PDF
                        </button>
                    </div>
                </header>

                <div class="editorial-content">
                    
                    <section id="les-trois-piliers" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">01</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Construire les trois piliers de sa crédibilité</h2>
                        </div>
                        
                        <p class="text-lg">Avant de multiplier les candidatures, prépare trois supports à jour : un CV, un profil LinkedIn et un portfolio.</p>
                        <p>Un recruteur doit pouvoir repérer le poste que tu vises et trouver des exemples concrets de ce que tu sais faire.</p>

                        <!-- Carte Pilier 1 -->
                        <div class="mt-8 p-6 md:p-8 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <i class="ph-fill ph-file-text text-xl"></i>
                                </div>
                                <h3 class="!mt-0 !mb-0 text-xl font-bold">Un CV lisible, adapté au poste visé</h3>
                            </div>
                            
                            <ul class="space-y-2 mt-4">
                                <li><strong>Mise en page :</strong> Choisis un modèle sobre et aéré, avec une structure de texte lisible. Évite les designs trop complexes ou uniquement graphiques.</li>
                                <li><strong>Clarté :</strong> Rédige des descriptions courtes, centrées sur tes missions et réalisations. Écarte les détails sans rapport avec le poste.</li>
                                <li><strong>Preuves :</strong> Donne des exemples concrets de réalisations.</li>
                                <li><strong>Relecture :</strong> Fais relire ton CV et demande à une IA de relever les formulations ambiguës. Vérifie chaque suggestion avant de la garder.</li>
                                <li><strong>Format :</strong> Prévois une version PDF propre et légère, avec une structure lisible par les logiciels de recrutement (ATS).</li>
                            </ul>
                            
                            <div class="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
                                <p class="text-sm !mb-0 text-blue-900 dark:text-blue-200"><strong>Une photo impeccable :</strong> Pour tes candidatures en France, considère une photo soignée comme indispensable. Choisis un portrait professionnel avec un visage bien éclairé, un léger sourire, un cadrage net et un fond sobre. Elle participe à la première impression du recruteur et l'aide à t'identifier parmi les candidatures : prends le temps de te mettre en valeur.</p>
                            </div>
                            <p class="mt-4 font-medium text-neutral-900 dark:text-neutral-100 border-l-4 border-red-500 pl-4">Place le poste visé et les technologies principales près du haut de la page.</p>
                        </div>

                        <!-- Carte Pilier 2 -->
                        <div class="mt-6 p-6 md:p-8 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                                    <i class="ph-fill ph-linkedin-logo text-xl"></i>
                                </div>
                                <h3 class="!mt-0 !mb-0 text-xl font-bold">Un LinkedIn qui explique ton positionnement</h3>
                            </div>
                            
                            <ul class="space-y-2 mt-4">
                                <li><strong>Titre explicite :</strong> Indique le poste recherché et les technologies que tu utilises.</li>
                                <li><strong>Complétude :</strong> Détaille tes expériences pertinentes, tes projets et ajoute tes compétences techniques. Affiche tes liens GitHub et Portfolio.</li>
                                <li><strong>Clarté :</strong> Explique la valeur que tu apportes, évite les formulations vagues et les listes de buzzwords.</li>
                                <li><strong>Preuve sociale :</strong> Demande des recommandations à d'anciens collègues ou formateurs.</li>
                            </ul>

                            <div class="mt-4 p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl relative group">
                                <div class="text-xs text-neutral-500 mb-1 uppercase tracking-wider font-semibold">Exemple de titre efficace</div>
                                <code class="text-sm font-medium text-neutral-800 dark:text-neutral-200 font-sans">Développeur Fullstack Junior | React • TypeScript • Node.js | Recherche CDI</code>
                            </div>
                            <p class="mt-4 font-medium text-neutral-900 dark:text-neutral-100 border-l-4 border-red-500 pl-4">Garde le même intitulé de poste et les mêmes compétences clés sur ton CV et LinkedIn.</p>
                        </div>

                        <!-- Carte Pilier 3 -->
                        <div class="mt-6 p-6 md:p-8 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                    <i class="ph-fill ph-browser text-xl"></i>
                                </div>
                                <h3 class="!mt-0 !mb-0 text-xl font-bold">Un portfolio qui démontre tes compétences</h3>
                            </div>
                            
                            <ul class="space-y-2 mt-4">
                                <li><strong>Sélection :</strong> Présente ta spécialisation et sélectionne tes projets les plus pertinents. Montre des applications réelles et fonctionnelles.</li>
                                <li><strong>Contexte :</strong> Pour chaque projet, explique le problème résolu, les technologies utilisées et justifie tes choix techniques.</li>
                                <li><strong>Accès :</strong> Donne un accès facile aux démonstrations en ligne et aux dépôts GitHub.</li>
                                <li><strong>Qualité technique :</strong> Teste l'affichage sur mobile, l'accessibilité au clavier et les performances. Vérifie les liens et corrige les erreurs repérées.</li>
                            </ul>
                            <p class="mt-4 font-medium text-neutral-900 dark:text-neutral-100 border-l-4 border-red-500 pl-4">Pour un projet collectif, distingue clairement ta contribution de celle de l'équipe.</p>
                        </div>

                        <p class="mt-8 italic text-neutral-500 dark:text-neutral-400">Ces supports ne garantissent pas un emploi. Ils donnent au recruteur des exemples concrets pour examiner ton profil et les projets que tu peux présenter.</p>
                    </section>

                    <section id="developper-reseau" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">02</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Développer activement son réseau</h2>
                        </div>

                        <p>Les annonces ne sont pas le seul point d'entrée. En échangeant avec des personnes du métier, tu peux demander conseil et parfois apprendre qu'une équipe prépare un recrutement.</p>

                        <h3>Identifier les bonnes personnes</h3>
                        <p>Ne te limite pas aux recruteurs. Cherche à entrer en contact avec ceux qui comprennent ton métier et ont des besoins :</p>
                        <div class="flex flex-wrap gap-2 mb-6">
                            <span class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">CTO</span>
                            <span class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">Tech Leads</span>
                            <span class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">Engineering Managers</span>
                            <span class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">Lead Developers</span>
                            <span class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">Fondateurs</span>
                            <span class="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm">Product Managers</span>
                        </div>
                        <p>Envoie quelques invitations ciblées et personnalise chaque message.</p>

                        <h3>Contacter directement les décisionnaires</h3>
                        <p>Écris un message bref qui explique ton profil et ce qui t'intéresse dans l'entreprise. Pour un premier échange, tu peux aussi demander un conseil ou proposer ton aide, plutôt que d'ouvrir directement par une demande de poste.</p>

                        <!-- Bloc de code copiable -->
                        <div class="mt-6 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-white dark:bg-neutral-800">
                            <div class="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                                <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Modèle de message d'approche</span>
                                <button data-guide-copy="msg-template" class="no-print text-neutral-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm" aria-label="Copier le message">
                                    <i class="ph ph-copy"></i> Copier
                                </button>
                            </div>
                            <div class="p-4 md:p-6 text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line font-mono leading-relaxed" id="msg-template">Bonjour [Prénom],

Je découvre votre travail chez [Entreprise] et je m'intéresse particulièrement à [élément précis du produit ou de l'équipe technique].

Je suis développeur junior spécialisé en [technologies] et je recherche actuellement [type d'opportunité].

Auriez-vous un conseil à me donner pour me rapprocher d'une équipe comme la vôtre ?

Merci pour votre temps.</div>
                        </div>
                        <p class="text-sm mt-2 text-neutral-500 italic">⚠️ Il s'agit d'un modèle à personnaliser absolument selon le contexte, pas d'un message à envoyer en masse.</p>
                    </section>

                    <section id="trouver-opportunites" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">03</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Multiplier les opportunités</h2>
                        </div>
                        <p>La recherche demande de la régularité. Combine réponses aux offres, candidatures spontanées et prises de contact directes.</p>
                        <ul>
                            <li>Consulte plusieurs plateformes, pas seulement LinkedIn. Va sur les sites carrières des entreprises.</li>
                            <li>Repère les entreprises qui utilisent ta stack technique.</li>
                            <li>N'attends pas de correspondre à 100% aux critères d'une annonce pour postuler.</li>
                            <li>Adapte tes candidatures pour les entreprises qui t'intéressent vraiment.</li>
                        </ul>
                        
                        <blockquote class="p-4 my-6 bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 text-amber-900 dark:text-amber-200 rounded-r-lg">
                            <strong class="block mb-1">Ne cherche pas uniquement les géants de la tech.</strong>
                            Les PME, agences web, éditeurs logiciels spécialisés, entreprises régionales et startups moins visibles représentent d'excellentes opportunités pour débuter.
                        </blockquote>
                    </section>

                    <section id="creer-contenu" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">04</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Créer du contenu pour être visible</h2>
                        </div>
                        <p>Produire du contenu permet de montrer ta progression, de partager tes connaissances et de ne plus être un profil anonyme. L'objectif n'est pas de devenir influenceur, mais de documenter ton travail.</p>
                        
                        <h3>Idées de contenus actionnables</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                                <div class="font-semibold text-sm mb-1 text-red-600 dark:text-red-400">Retour d'expérience</div>
                                <div class="text-sm italic text-neutral-600 dark:text-neutral-400">"J'ai rencontré ce problème de performance. Voici comment je l'ai résolu."</div>
                            </div>
                            <div class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                                <div class="font-semibold text-sm mb-1 text-red-600 dark:text-red-400">Apprentissage</div>
                                <div class="text-sm italic text-neutral-600 dark:text-neutral-400">"Voici trois choses que j'ai comprises en apprenant TypeScript cette semaine."</div>
                            </div>
                            <div class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                                <div class="font-semibold text-sm mb-1 text-red-600 dark:text-red-400">Démonstration</div>
                                <div class="text-sm italic text-neutral-600 dark:text-neutral-400">"Courte vidéo montrant le fonctionnement de ma nouvelle application."</div>
                            </div>
                            <div class="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                                <div class="font-semibold text-sm mb-1 text-red-600 dark:text-red-400">Comparaison</div>
                                <div class="text-sm italic text-neutral-600 dark:text-neutral-400">"REST ou GraphQL : voici les différences pratiques que j'ai observées."</div>
                            </div>
                        </div>

                        <h3>Conseils de publication</h3>
                        <ul>
                            <li><strong>Régularité :</strong> Définis une cadence soutenable. Ne sacrifie pas ton apprentissage technique pour créer du contenu.</li>
                            <li><strong>Authenticité :</strong> Écris avec tes mots. L'IA peut corriger, mais l'expérience doit être la tienne.</li>
                            <li><strong>Interactions :</strong> Laisse des commentaires pertinents sous les publications de professionnels et participe régulièrement aux discussions techniques.</li>
                        </ul>
                    </section>

                    <section id="preparer-entretiens" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">05</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Se préparer aux entretiens</h2>
                        </div>
                        <p>Prépare tes entretiens autour de quatre situations fréquentes :</p>

                        <div class="space-y-6">
                            <div>
                                <h3 class="!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">A. Entretien RH & Motivation</h3>
                                <p class="text-sm">Sache présenter ton parcours et tes motivations en quelques phrases. Si tu es en reconversion, explique ce qui t'a conduit vers le développement. Prépare des questions à poser sur l'entreprise.</p>
                                
                                <div class="mt-3 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                                    <div class="flex items-center justify-between px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-700">
                                        <span class="text-xs font-medium text-neutral-500">Prompt IA d'entraînement</span>
                                        <button data-guide-copy="prompt-template" class="no-print text-neutral-500 hover:text-red-600 text-xs flex items-center gap-1">Copier</button>
                                    </div>
                                    <div class="p-3 text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-line font-mono" id="prompt-template">Joue le rôle d'un recruteur technique exigeant qui fait passer un entretien à un développeur junior. Pose-moi les questions une par une. Attends ma réponse avant de continuer. Après chaque réponse, évalue sa clarté, sa pertinence et identifie les éléments manquants.</div>
                                </div>
                            </div>

                            <div>
                                <h3 class="!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">B. Algorithmique & Live Coding</h3>
                                <p class="text-sm">Entraîne-toi sur <a href="https://www.codingame.com/start/" class="text-red-600 underline underline-offset-2 hover:text-red-500 dark:text-red-400">CodinGame</a> ou LeetCode. Décompose le problème avant de coder et explique ton raisonnement à voix haute. La méthode compte autant que le résultat.</p>
                            </div>

                            <div>
                                <h3 class="!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">C. Questions Techniques</h3>
                                <p class="text-sm">Maîtrise les fondamentaux de ta stack. Comprends les concepts plutôt que de réciter des définitions. Sois capable de dire "je ne sais pas, mais voici comment je chercherais".</p>
                            </div>

                            <div>
                                <h3 class="!mt-0 !mb-3 !text-lg !font-semibold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">D. Études de cas & Architecture</h3>
                                <p class="text-sm">On peut te demander d'imaginer l'architecture d'une app simple. Identifie le besoin métier, choisis la BDD, le front, l'API et justifie tes compromis techniques.</p>
                            </div>
                        </div>
                    </section>

                    <section id="organiser-recherche" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">06</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Organiser sa recherche</h2>
                        </div>
                        <p>Tiens un tableau (Notion, Excel) pour noter les candidatures envoyées, les relances prévues et les réponses reçues.</p>
                        
                        <div class="overflow-x-auto my-6 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                            <table class="w-full text-sm text-left">
                                <caption class="sr-only">Exemple de tableau de suivi des candidatures</caption>
                                <thead class="text-xs text-neutral-500 uppercase bg-neutral-50 dark:bg-neutral-800/50">
                                    <tr>
                                        <th scope="col" class="px-4 py-3">Entreprise</th>
                                        <th scope="col" class="px-4 py-3">Poste</th>
                                        <th scope="col" class="px-4 py-3">Statut</th>
                                        <th scope="col" class="px-4 py-3">Prochaine action</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    <tr class="bg-white dark:bg-neutral-900">
                                        <th scope="row" class="px-4 py-3 text-left font-medium">Entreprise A</th>
                                        <td class="px-4 py-3">Dev React</td>
                                        <td class="px-4 py-3"><span class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded text-xs">Candidature envoyée</span></td>
                                        <td class="px-4 py-3 text-neutral-500">Noter une date de relance</td>
                                    </tr>
                                    <tr class="bg-white dark:bg-neutral-900">
                                        <th scope="row" class="px-4 py-3 text-left font-medium">Entreprise B</th>
                                        <td class="px-4 py-3">Développeur full stack</td>
                                        <td class="px-4 py-3"><span class="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 rounded text-xs">Entretien programmé</span></td>
                                        <td class="px-4 py-3 text-neutral-500">Préparer les questions techniques</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section id="rencontrer-professionnels" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">07</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Sortir des candidatures en ligne</h2>
                        </div>
                        <p>Les meetups techniques, job datings et conférences locales donnent l'occasion d'échanger directement avec des professionnels. Après la rencontre, ajoute-les sur LinkedIn et rappelle le sujet dont vous avez parlé.</p>
                    </section>

                    <section id="dix-conseils" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">08</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Dix conseils supplémentaires pour se démarquer</h2>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Conseil 1 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#1 Définir un positionnement clair</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Mieux vaut être identifiable sur une stack précise que se dire expert en tout.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Définis en une phrase ton poste et ta stack.
                                </div>
                            </div>
                            <!-- Conseil 2 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#2 Maîtriser les fondamentaux</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Les bases de JavaScript, HTML/CSS, HTTP et SQL te serviront sur différents projets, même si les frameworks changent.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Révise l'asynchrone, la manipulation du DOM et les API.
                                </div>
                            </div>
                            <!-- Conseil 3 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#3 Soigner son GitHub</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">C'est la preuve concrète de ta manière de coder et de documenter.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Épingle quelques projets représentatifs avec des README explicatifs.
                                </div>
                            </div>
                            <!-- Conseil 4 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#4 Construire un vrai produit</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Un projet abouti comme <a href="/fr#projectsContainer" class="text-red-600 underline underline-offset-2 hover:text-red-500 dark:text-red-400">Smartflow, présenté dans mon portfolio</a>, avec conception, architecture, choix de stack, maquettes et tests, est plus parlant qu'une liste de tutoriels inachevés.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Choisis un périmètre adapté et documente tes choix techniques ainsi que la gestion des erreurs.
                                </div>
                            </div>
                            <!-- Conseil 5 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#5 Montrer comment tu travailles en équipe</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Une contribution open source ou un hackathon peut te donner une situation concrète à raconter en entretien.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Décris ton rôle, les décisions prises en équipe et la répartition du travail.
                                </div>
                            </div>
                            <!-- Conseil 6 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#6 Personnaliser ses candidatures</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Une candidature ciblée te permet de relier ton profil aux besoins de l'offre.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Relie une compétence demandée à un exemple tiré de tes projets.
                                </div>
                            </div>
                            <!-- Conseil 7 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#7 Activer la cooptation</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Tes anciens camarades ou formateurs peuvent te renseigner sur les entreprises qui recrutent.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Demande des mises en relation ciblées.
                                </div>
                            </div>
                            <!-- Conseil 8 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#8 Développer ses soft skills</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Savoir expliquer un blocage et demander de l'aide fait aussi partie du travail en équipe.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Présente ce que tu as essayé, le résultat et l'aide qu'il te faut.
                                </div>
                            </div>
                            <!-- Conseil 9 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#9 Utiliser l'IA intelligemment</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Un assistant pour accélérer, pas une béquille qui code à ta place.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Comprends et teste chaque ligne suggérée par l'IA.
                                </div>
                            </div>
                            <!-- Conseil 10 -->
                            <div class="card p-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                                <h3 class="!mt-0 !mb-2 !text-base !font-bold text-red-500">#10 Ajuster sa recherche</h3>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Après plusieurs candidatures sans réponse, vérifie si les offres visées correspondent à ton profil.</p>
                                <div class="text-sm font-medium border-t border-neutral-100 dark:border-neutral-800 pt-3">
                                    <span class="text-neutral-900 dark:text-neutral-100">Action :</span> Compare les offres à ton CV et à tes projets, puis ajuste ta cible ou leur présentation.
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="erreurs-a-eviter" class="scroll-mt-24 mb-16">
                        <div class="flex items-baseline gap-4 mb-8">
                            <span class="text-3xl font-light text-neutral-600 dark:text-neutral-300">09</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Ce qu'il faut éviter</h2>
                        </div>
                        <ul class="space-y-3">
                            <li class="flex items-start gap-3">
                                <i class="ph-fill ph-x-circle text-red-500 mt-1"></i>
                                <span>Postuler avec un CV bâclé ou inachevé. Avant la première candidature, finalise un CV irréprochable : clair, sans fautes, bien présenté et adapté au poste. Ce travail de préparation est la base pour être compétitif et éviter de griller tes premières opportunités.</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="ph-fill ph-x-circle text-red-500 mt-1"></i>
                                <span>Confondre la multiplication aveugle des candidatures avec l'efficacité.</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="ph-fill ph-x-circle text-red-500 mt-1"></i>
                                <span>Confondre popularité sur LinkedIn et réelles compétences de développeur.</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="ph-fill ph-x-circle text-red-500 mt-1"></i>
                                <span>Prétendre maîtriser des technologies qu'on ne comprend pas vraiment en profondeur.</span>
                            </li>
                            <li class="flex items-start gap-3">
                                <i class="ph-fill ph-x-circle text-red-500 mt-1"></i>
                                <span>Présenter un projet généré à 100% par IA sans pouvoir en expliquer l'architecture.</span>
                            </li>
                        </ul>
                    </section>

                    <section id="checklist-finale" class="scroll-mt-24 mb-16 bg-neutral-50 dark:bg-neutral-800 p-6 md:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800">
                        <div class="flex items-baseline gap-4 mb-6">
                            <span class="text-3xl font-light text-red-300 dark:text-red-900/50">10</span>
                            <h2 class="!mt-0 !mb-0 text-3xl font-bold">Ta checklist pour passer à l'action</h2>
                        </div>
                        <p class="mb-6">Coche les étapes réalisées. Ta progression est sauvegardée dans ce navigateur.</p>

                        <!-- Composant Checklist -->
                        <div class="no-print">
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-sm font-semibold text-neutral-500 uppercase tracking-wider" id="checklist-progress-text" aria-live="polite" aria-atomic="true">0/14 étapes terminées</span>
                                <button id="reset-checklist" class="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 underline decoration-red-200 dark:decoration-red-900/50 underline-offset-4">Réinitialiser</button>
                            </div>
                            <div class="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full mb-6 overflow-hidden">
                                <div id="checklist-progress-bar" class="bg-red-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>

                            <div class="space-y-3" id="checklist-container">
                                <!-- Les items seront générés ou gérés via JS, mais on les met en HTML pour l'accessibilité initiale -->
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-1">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Mon CV est clair, aéré et a été relu.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-2">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Mon profil LinkedIn est complet et précis.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-3">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Mon portfolio présente mes meilleurs projets en ligne.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-4">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Mon GitHub démontre mes compétences (README soignés).</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-5">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">J'ai défini mon poste cible et ma stack principale.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-6">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">J'ai identifié une liste d'entreprises pertinentes.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-7">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">J'ai commencé à contacter des professionnels sur LinkedIn.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-8">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Je dispose d'un outil de suivi (Notion, Excel) pour mes candidatures.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-9">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Je m'entraîne régulièrement aux tests techniques (algo/live coding).</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-10">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">J'ai préparé mon pitch de présentation personnelle (2 min).</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-11">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">Je sais justifier l'architecture de mes projets personnels.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-12">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">J'ai identifié des meetups ou événements tech près de chez moi.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-13">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">J'ai défini une routine de recherche soutenable dans la durée.</span>
                                </label>
                                <label class="checklist-item flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                                    <input type="checkbox" class="checkbox-custom mt-0.5" data-id="chk-14">
                                    <span class="text-neutral-700 dark:text-neutral-300 font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">J'analyse mes résultats (retours positifs/négatifs) pour m'améliorer.</span>
                                </label>
                            </div>
                        </div>
                        <div class="hidden print:block">
                            <p><em>(La version interactive de la checklist est disponible sur la version web du guide).</em></p>
                        </div>
                    </section>

                    <section class="border-t border-neutral-200 dark:border-neutral-800 pt-16 mb-16">
                        <h2 class="text-2xl font-bold mb-4">Pour faire avancer ta recherche</h2>
                        <p>Commence par mettre à jour ton CV et choisir quelques projets que tu peux présenter. Cible ensuite des entreprises qui recrutent sur ta stack, suis tes démarches et ajuste tes candidatures selon les échanges obtenus.</p>

                        <div class="mt-12 p-6 md:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 items-center bg-neutral-200 dark:bg-neutral-800 rounded-3xl">
                            <img src="/pp.jpg" alt="Vincent DESBROSSES" width="128" height="128" loading="lazy" decoding="async" class="w-32 h-32 flex-shrink-0 object-cover rounded-full ring-4 ring-red-500 p-2 transition-all duration-300 hover:ring-red-400 dark:hover:ring-red-600">
                            <div class="text-center sm:text-left">
                                <h3 class="!mt-0 !mb-1 text-xl font-bold">Vincent DESBROSSES</h3>
                                <div class="text-red-600 dark:text-red-400 font-medium text-sm mb-3">Développeur Fullstack</div>
                                <p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Je conçois et développe des applications web modernes en portant une attention particulière à l'expérience utilisateur, à la qualité logicielle et à la compréhension des besoins produit.</p>
                                <a href="/fr" class="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                    Découvrir mon portfolio <i class="ph-bold ph-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </section>

                </div>
            </article>
        </main>
    </div>

    <footer class="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-12 mt-12 no-print">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="text-neutral-500 dark:text-neutral-400 text-sm">
                &copy; 2026 Vincent DESBROSSES. Guide gratuit.
            </div>
            <div class="flex gap-6 text-sm font-medium">
                <a href="/fr/blog" class="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Retour au blog</a>
                <a href="/fr" class="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Portfolio</a>
                <button data-guide-print class="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">Télécharger PDF</button>
            </div>
        </div>
    </footer>

    <!-- Feedback visuel (Toast) -->
    <div id="toast" role="status" aria-live="polite" aria-atomic="true" class="fixed bottom-4 right-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transform translate-y-20 opacity-0 transition-all duration-300 z-50 flex items-center gap-2">
        <i class="ph-fill ph-check-circle text-red-400 dark:text-red-600 text-lg"></i>
        <span id="toast-message">Action réussie</span>
    </div>

    <!-- Bouton retour en haut (Mobile) -->
    <button id="back-to-top" class="fixed bottom-4 left-4 bg-red-600 text-white p-3 rounded-full shadow-lg md:hidden opacity-0 invisible transition-all duration-300 transform translate-y-4 hover:bg-red-700 z-40" aria-label="Retour en haut">
        <i class="ph-bold ph-arrow-up"></i>
    </button>
`;
