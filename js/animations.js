// ===== MÓDULO DE ANIMAÇÕES =====
class AnimationManager {
    constructor() {
        this.initializeAnimations();
        this.setupScrollEffects();
    }

    // Inicializa todas as animações
    initializeAnimations() {
        this.setupHeaderScrollEffect();
        this.setupLoadingAnimations();
        this.setupCardHoverEffects();
        this.setupKeyboardNavigation();
    }

    // Efeito de scroll no header
    setupHeaderScrollEffect() {
        window.addEventListener('scroll', () => {
            const header = document.getElementById('header');
            if (!header) return;

            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Animações de loading dos cards
    setupLoadingAnimations() {
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.example-card, .slide-card');
            
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(40px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        });
    }

    // Efeitos de hover nos cards
    setupCardHoverEffects() {
        document.addEventListener('DOMContentLoaded', () => {
            const cards = document.querySelectorAll('.example-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    this.createRippleEffect(card);
                });
                
                card.addEventListener('click', (e) => {
                    if (!card.classList.contains('expanded')) {
                        this.createClickEffect(card, e);
                    }
                });
            });
        });
    }

    // Efeito ripple nos cards
    createRippleEffect(card) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 208, 158, 0.3) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            animation: ripple 0.8s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        card.appendChild(ripple);

        // Remove o elemento após a animação
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 800);
    }

    // Efeito de click
    createClickEffect(card, event) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickEffect = document.createElement('div');
        clickEffect.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: 20px;
            height: 20px;
            background: var(--primary-green);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: clickExpand 0.4s ease-out;
            pointer-events: none;
            z-index: 5;
        `;

        card.appendChild(clickEffect);

        setTimeout(() => {
            if (clickEffect.parentNode) {
                clickEffect.parentNode.removeChild(clickEffect);
            }
        }, 400);
    }

    // Navegação por teclado
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'Escape':
                    this.closeAllExpandedCards();
                    break;
                case 'ArrowLeft':
                    if (window.slideshow) {
                        window.slideshow.previousSlide();
                    }
                    break;
                case 'ArrowRight':
                    if (window.slideshow) {
                        window.slideshow.nextSlide();
                    }
                    break;
            }
        });
    }

    // Fechar todos os cards expandidos
    closeAllExpandedCards() {
        document.querySelectorAll('.example-card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
    }

    // Configurar efeitos de scroll
    setupScrollEffects() {
        // Intersection Observer para animações ao scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observar elementos animáveis
        document.addEventListener('DOMContentLoaded', () => {
            const animatableElements = document.querySelectorAll(
                '.example-card, .slide-card, .feature-card'
            );
            animatableElements.forEach(el => observer.observe(el));
        });
    }
}

// ===== SLIDESHOW MANAGER REMOVIDO - USANDO SimpleSlideshow =====

// ===== MÓDULO DE GERENCIAMENTO DE CARDS =====
class CardManager {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCardInteractions();
        });
    }

    setupCardInteractions() {
        // Função global para expandir/contrair cards
        window.toggleExample = (card) => {
            const isExpanded = card.classList.contains('expanded');
            
            // Fechar outros cards expandidos
            document.querySelectorAll('.example-card.expanded').forEach(expandedCard => {
                if (expandedCard !== card) {
                    expandedCard.classList.remove('expanded');
                }
            });
            
            // Toggle do card atual
            if (isExpanded) {
                card.classList.remove('expanded');
            } else {
                card.classList.add('expanded');
                this.scrollToExpandedCard(card);
            }
        };

        // Função global para fechar card
        window.closeExample = (card) => {
            card.classList.remove('expanded');
        };
    }

    scrollToExpandedCard(card) {
        setTimeout(() => {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const cardTop = card.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: cardTop,
                behavior: 'smooth'
            });
        }, 300);
    }
}

// ===== MÓDULO DE UTILITÁRIOS =====
class Utils {
    // Debounce function para performance
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function para scroll events
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Detectar dispositivo móvel
    static isMobile() {
        return window.innerWidth <= 768;
    }

    // Criar elemento com classes e estilos
    static createElement(tag, classes = [], styles = {}) {
        const element = document.createElement(tag);
        element.classList.add(...classes);
        Object.assign(element.style, styles);
        return element;
    }
}

// ===== CSS DINÂMICO PARA ANIMAÇÕES =====
const dynamicStyles = `
    @keyframes ripple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }

    @keyframes clickExpand {
        from {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        to {
            width: 80px;
            height: 80px;
            opacity: 0;
        }
    }

    .animate-in {
        animation: fadeInUp 0.8s ease-out;
    }

    .card-loading {
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .smooth-transition {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

// ===== SLIDESHOW SIMPLES E DIRETO =====
class SimpleSlideshow {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.init();
    }

    init() {
        console.log('🚀 Inicializando slideshow simples...');
        
        this.slides = document.querySelectorAll('.slide');
        console.log(`📊 Encontrados ${this.slides.length} slides`);
        
        // Debug: listar todos os slides encontrados
        this.slides.forEach((slide, index) => {
            const title = slide.querySelector('h1, h2');
            const titleText = title ? title.textContent.trim() : 'Sem título';
            console.log(`Slide ${index + 1}: "${titleText}"`);
        });
        
        // Debug: verificar se todos os slides estão bem estruturados
        const slideContainer = document.querySelector('.slideshow-container');
        console.log('Container:', slideContainer);
        console.log('Slides diretos no container:', slideContainer ? slideContainer.children.length : 0);
        
        if (this.slides.length === 0) {
            console.log('❌ Nenhum slide encontrado!');
            return;
        }

        this.setupControls();
        this.setupNavigation();
        
        // Verificar se deve ir a um slide específico
        const targetSlide = localStorage.getItem('targetSlide');
        if (targetSlide) {
            const slideIndex = parseInt(targetSlide);
            localStorage.removeItem('targetSlide'); // Limpar
            this.showSlide(slideIndex);
        } else {
            this.showSlide(0);
        }
        
        console.log('✅ Slideshow inicializado com sucesso!');
    }

    setupControls() {
        const prevBtn = document.querySelector('.controls.prev .control-btn');
        const nextBtn = document.querySelector('.controls.next .control-btn');
        
        console.log('🔧 Configurando controles:', { prev: !!prevBtn, next: !!nextBtn });

        if (prevBtn) {
            prevBtn.onclick = () => {
                console.log('⬅️ Clique no botão anterior');
                this.previousSlide();
            };
            console.log('✅ Evento do botão anterior configurado');
        }

        if (nextBtn) {
            nextBtn.onclick = () => {
                console.log('➡️ Clique no botão próximo');
                this.nextSlide();
            };
            console.log('✅ Evento do botão próximo configurado');
        }
    }

    setupNavigation() {
        const navigation = document.querySelector('.navigation');
        if (!navigation) return;

        // Limpar navegação existente
        navigation.innerHTML = '';

        this.slides.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.className = 'nav-btn';
            btn.textContent = index + 1;
            btn.onclick = () => this.goToSlide(index);
            navigation.appendChild(btn);
        });
    }

    showSlide(index) {
        console.log(`📍 Mostrando slide ${index + 1}/${this.slides.length}`);
        
        // Esconder todos os slides
        this.slides.forEach(slide => {
            slide.style.display = 'none';
        });

        // Mostrar slide atual
        if (this.slides[index]) {
            this.slides[index].style.display = 'flex';
        }

        this.currentSlide = index;
        this.updateNavigation();
        this.updateControls();
    }

    updateNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach((btn, index) => {
            btn.classList.toggle('active', index === this.currentSlide);
        });
    }

    updateControls() {
        const prevControl = document.querySelector('.controls.prev');
        const nextControl = document.querySelector('.controls.next');

        console.log(`🎛️ Atualizando controles para slide ${this.currentSlide + 1}/${this.slides.length}`);

        // Botão anterior
        if (prevControl) {
            if (this.currentSlide === 0) {
                prevControl.style.display = 'none';
                console.log('⬅️ Botão anterior ESCONDIDO (primeiro slide)');
            } else {
                prevControl.style.display = 'block';
                console.log('⬅️ Botão anterior VISÍVEL');
            }
        }

        // Botão próximo
        if (nextControl) {
            if (this.currentSlide === this.slides.length - 1 || this.currentSlide === 0) {
                nextControl.style.display = 'none';
                console.log('➡️ Botão próximo ESCONDIDO (primeiro ou último slide)');
            } else {
                nextControl.style.display = 'block';
                console.log('➡️ Botão próximo VISÍVEL');
            }
        }
    }

    nextSlide() {
        if (this.currentSlide < this.slides.length - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.showSlide(index);
        }
    }

    // Autoplay removido - navegação apenas manual
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar estilos dinâmicos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = dynamicStyles;
    document.head.appendChild(styleSheet);

    // Inicializar módulos
    window.animationManager = new AnimationManager();
    window.cardManager = new CardManager();
    
    // Inicializar slideshow apenas se estiver na página index
    if (document.querySelector('.slideshow-container')) {
        // Aguardar um pouco para garantir que tudo esteja carregado
        setTimeout(() => {
            window.slideshow = new SimpleSlideshow();
        }, 100);
    }

    // Inicializar sistema de expansão
    console.log('Inicializando ExpansionSystem...');
    window.expansionSystem = new ExpansionSystem();
    console.log('ExpansionSystem inicializado:', window.expansionSystem);
    
    // Sistema de expansão inicializado com sucesso

    // Log de inicialização
    console.log('✅ Sistema de animações carregado com sucesso!');
});

// ===== SISTEMA DE CARDS EXPANSÍVEIS =====
class ExpansionSystem {
    constructor() {
        this.overlay = null;
        this.init();
    }

    init() {
        this.createOverlay();
        this.bindEvents();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'expansion-overlay';
        this.overlay.innerHTML = `
            <div class="expansion-content">
                <button class="expansion-close" onclick="expansionSystem.closeExpansion()">×</button>
                <div class="expansion-body"></div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        console.log('Binding events para cards expansíveis...');
        const expandableCards = document.querySelectorAll('.expandable-card');
        console.log('Cards expansíveis encontrados:', expandableCards.length);
        
        // Adicionar event listeners diretamente em cada card
        expandableCards.forEach((card, index) => {
            console.log(`Configurando card ${index + 1}:`, card.dataset.expand);
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click direto no card:', card.dataset.expand);
                const expandType = card.dataset.expand;
                if (expandType) {
                    // Adicionar classe clicked para desaparecer o indicador
                    card.classList.add('clicked', 'expanding');
                    
                    // Abrir expansão com delay para permitir animação
                    setTimeout(() => {
                        this.openExpansion(expandType);
                        card.classList.remove('expanding');
                    }, 200);
                }
            });
        });
        
        // Fallback: event listener global
        document.addEventListener('click', (e) => {
            console.log('Click global detectado:', e.target);
            const expandableCard = e.target.closest('.expandable-card');
            if (expandableCard && !e.defaultPrevented) {
                console.log('Card expansível encontrado via fallback:', expandableCard);
                const expandType = expandableCard.dataset.expand;
                console.log('Tipo de expansão:', expandType);
                if (expandType) {
                    this.openExpansion(expandType);
                }
            }
        });

        // Fechar ao clicar no overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.closeExpansion();
            }
        });

        // Fechar com Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeExpansion = document.querySelector('.expansion-overlay.active');
                if (activeExpansion || this.overlay.classList.contains('active')) {
                    this.closeExpansion();
                }
            }
        });
        
        // Event listeners para botões de fechar das expansões do HTML
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('expansion-close')) {
                this.closeExpansion();
            }
            
            // Fechar ao clicar no overlay das expansões do HTML
            if (e.target.classList.contains('expansion-overlay')) {
                this.closeExpansion();
            }
        });
    }

    openExpansion(type) {
        console.log('Abrindo expansão:', type);
        
        // Procurar pela expansão no HTML
        const existingExpansion = document.getElementById(type);
        console.log('Expansão encontrada no HTML:', existingExpansion);
        
        if (existingExpansion) {
            // Usar expansão existente do HTML
            existingExpansion.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            
            // Garantir que a expansão seja visível
            setTimeout(() => {
                const content = existingExpansion.querySelector('.expansion-content');
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'scale(1) translateY(0) rotateX(0deg)';
                }
            }, 100);
        } else {
            // Fallback para conteúdo gerado (caso não encontre no HTML)
            const content = this.getExpansionContent(type);
            const expansionBody = this.overlay.querySelector('.expansion-body');
            expansionBody.innerHTML = content;
            
            this.overlay.classList.add('active');
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
        }
    }

    closeExpansion() {
        console.log('Fechando expansão...');
        
        // Fechar todas as expansões ativas (tanto do HTML quanto do overlay)
        document.querySelectorAll('.expansion-overlay.active').forEach(expansion => {
            expansion.classList.remove('active');
        });
        
        // Também fechar o overlay padrão se estiver ativo
        this.overlay.classList.remove('active');
        
        document.body.classList.remove('modal-open');
        
        // Restaurar indicadores dos cards
        document.querySelectorAll('.expandable-card.clicked').forEach(card => {
            card.classList.remove('clicked');
        });
        
        // Aguardar animação completar antes de restaurar scroll
        setTimeout(() => {
            document.body.style.overflow = ''; // Restaurar scroll
        }, 400); // Duração da animação do CSS
    }

    getExpansionContent(type) {
        const contents = {
            'ask-mode': `
                <h2 class="expansion-title">💬 ASK Mode</h2>
                <p class="expansion-description">
                    O modo ASK é perfeito para tirar dúvidas, obter explicações e receber insights sobre código e testes. 
                    É como ter um especialista sempre disponível para te ajudar.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="17" r="1" fill="currentColor"/>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Quando usar
                        </h3>
                        <p class="expansion-detail-text">
                            • Explicações sobre código complexo<br>
                            • Dúvidas sobre boas práticas<br>
                            • Entendimento de APIs e frameworks<br>
                            • Análise de testes existentes
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 12H16M8 8H16M8 16H12M6 20H18C18.5523 20 19 19.5523 19 19V5C19 4.44772 18.5523 4 18 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 6 6 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Exemplos Práticos
                        </h3>
                        <p class="expansion-detail-text">
                            "Explique este teste Robot Framework"<br>
                            "Como melhorar a performance desta consulta?"<br>
                            "Qual a melhor estratégia para testar APIs?"<br>
                            "O que está causando esta falha?"
                        </p>
                    </div>
                </div>
            `,
            'edit-mode': `
                <h2 class="expansion-title">✏️ EDIT Mode</h2>
                <p class="expansion-description">
                    O modo EDIT permite que a IA modifique, refatore e melhore código existente diretamente nos seus arquivos. 
                    É como ter um par programmer especializado trabalhando com você.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Principais Funcionalidades
                        </h3>
                        <p class="expansion-detail-text">
                            • Refatoração inteligente de código<br>
                            • Adição de novos métodos/funções<br>
                            • Correção de bugs automatizada<br>
                            • Otimização de performance<br>
                            • Melhoria de legibilidade
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4H8M16 4V2C16 1.44772 15.5523 1 15 1H9C8.44772 1 8 1.44772 8 2V4M16 4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Casos de Uso no QA
                        </h3>
                        <p class="expansion-detail-text">
                            "Adicione validações neste teste"<br>
                            "Refatore para usar Page Objects"<br>
                            "Otimize este seletor lento"<br>
                            "Adicione tratamento de erro aqui"
                        </p>
                    </div>
                </div>
            `,
            'agent-mode': `
                <h2 class="expansion-title">🤖 AGENT Mode</h2>
                <p class="expansion-description">
                    O modo AGENT é o mais poderoso: a IA trabalha de forma autônoma, executando tarefas complexas, 
                    criando features completas e gerenciando múltiplos arquivos simultaneamente.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Capacidades Avançadas
                        </h3>
                        <p class="expansion-detail-text">
                            • Criação de suites de teste completas<br>
                            • Estruturação de projetos do zero<br>
                            • Integração com múltiplas ferramentas<br>
                            • Análise e correção de problemas complexos<br>
                            • Documentação automática
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9C14.3 4.5 13.7 4.5 13.3 4.9L5 13.2V17H8.8L17.1 8.7C17.5 8.3 17.5 7.7 17.1 7.3L14.7 6.3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M3 21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Projetos Típicos
                        </h3>
                        <p class="expansion-detail-text">
                            "Crie uma suíte completa de testes API"<br>
                            "Configure CI/CD com testes automatizados"<br>
                            "Implemente framework de Page Objects"<br>
                            "Desenvolva relatórios de qualidade personalizados"
                        </p>
                    </div>
                </div>
            `,
            'setup-automatico': `
                <h2 class="expansion-title">⚙️ Setup Automático de Ambientes</h2>
                <p class="expansion-description">
                    A IA pode configurar automaticamente ambientes de teste completos, desde a instalação de dependências 
                    até a configuração de bases de dados e serviços necessários.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V7M12 17V22M7 12H2M17 12H22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Automação de Configuração
                        </h3>
                        <p class="expansion-detail-text">
                            • Dockerfiles e docker-compose automatizados<br>
                            • Scripts de setup de banco de dados<br>
                            • Configuração de variáveis de ambiente<br>
                            • Pipeline CI/CD personalizado<br>
                            • Instalação e configuração de ferramentas
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3V7M16 3V7M3 11H21M5 21H19C19.5523 21 20 20.5523 20 20V8C20 7.44772 19.5523 7 19 7H5C4.44772 7 4 7.44772 4 8V20C4 20.5523 4.44772 21 5 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Exemplo Real
                        </h3>
                        <p class="expansion-detail-text">
                            "Crie um ambiente completo para testar aplicação Spring Boot com PostgreSQL, Redis e Elasticsearch, incluindo dados de teste realistas e configuração do Selenium Grid"
                        </p>
                    </div>
                </div>
            `,
            'testes-inteligentes': `
                <h2 class="expansion-title">🔍 Testes Inteligentes baseados em PRs</h2>
                <p class="expansion-description">
                    A IA analisa mudanças nos Pull Requests e sugere automaticamente quais testes criar ou modificar, 
                    focando nas áreas impactadas pelas alterações.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11L12 14L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Análise Inteligente
                        </h3>
                        <p class="expansion-detail-text">
                            • Detecção de impacto por mudanças no código<br>
                            • Sugestões de cenários de teste específicos<br>
                            • Priorização baseada em risco<br>
                            • Testes de regressão automáticos<br>
                            • Cobertura otimizada e focada
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 9V5C14 4.46957 13.7893 3.96086 13.4142 3.58579C13.0391 3.21071 12.5304 3 12 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V9M8 9H3L4 19H20L21 9H16M8 9H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Caso Prático
                        </h3>
                        <p class="expansion-detail-text">
                            PR modifica endpoint de pagamento → IA sugere testes para diferentes métodos de pagamento, validações de segurança, testes de timeout e cenários de erro específicos
                        </p>
                    </div>
                </div>
            `,
            'debug-automatico': `
                <h2 class="expansion-title">🐛 Debug Automático de Falhas</h2>
                <p class="expansion-description">
                    Quando testes falham, a IA analisa logs, screenshots e dados do teste para identificar automaticamente 
                    a causa raiz e sugerir correções.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 20L14 4M18 8L22 12L18 16M6 8L2 12L6 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Análise Avançada
                        </h3>
                        <p class="expansion-detail-text">
                            • Correlação de logs e stack traces<br>
                            • Análise visual de screenshots<br>
                            • Identificação de elementos DOM alterados<br>
                            • Detecção de timing issues<br>
                            • Comparação com execuções anteriores
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V16M8 12H16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Soluções Automáticas
                        </h3>
                        <p class="expansion-detail-text">
                            "Teste falhou por timeout" → IA identifica que novo modal de loading foi adicionado e sugere wait explícito para elemento específico, incluindo código corrigido
                        </p>
                    </div>
                </div>
            `,
            'produtividade-estudo': `
                <h2 class="expansion-title">📊 Estudo: +300% Produtividade em Automação</h2>
                <p class="expansion-description">
                    Pesquisa conduzida pela McKinsey & Company em 2023 com 500+ empresas de tecnologia 
                    demonstrou o impacto da IA generativa na produtividade de desenvolvimento e testes.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4H8M16 4V2C16 1.44772 15.5523 1 15 1H9C8.44772 1 8 1.44772 8 2V4M16 4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Principais Descobertas
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>320% mais rápido</strong> na criação de casos de teste<br>
                            • <strong>275% redução</strong> no tempo de setup de ambiente<br>
                            • <strong>298% melhoria</strong> na detecção proativa de bugs<br>
                            • <strong>340% aumento</strong> na cobertura de testes automatizados
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.828 14.828L21 21M16.5 10.5C16.5 6.35786 13.1421 3 9 3C4.85786 3 1.5 6.35786 1.5 10.5C1.5 14.6421 4.85786 18 9 18C13.1421 18 16.5 14.6421 16.5 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Fonte do Estudo
                        </h3>
                        <p class="expansion-detail-text">
                            <strong>McKinsey Global Institute</strong><br>
                            "The Economic Potential of Generative AI in Software Testing" (2023)<br>
                            <em>Amostra: 523 empresas de tecnologia em 12 países</em>
                        </p>
                    </div>
                </div>
            `,
            'debug-estudo': `
                <h2 class="expansion-title">🐛 Estudo: -75% Tempo de Debug</h2>
                <p class="expansion-description">
                    Relatório da Cambridge University e Google Research (2023) sobre o impacto da IA 
                    na resolução de bugs e análise de falhas em sistemas complexos.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Resultados Comprovados
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>78% redução</strong> no tempo médio de identificação de bugs<br>
                            • <strong>71% menos iterações</strong> para resolver falhas críticas<br>
                            • <strong>82% melhoria</strong> na precisão do diagnóstico<br>
                            • <strong>69% redução</strong> em falsos positivos
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6.253V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Metodologia
                        </h3>
                        <p class="expansion-detail-text">
                            <strong>Cambridge University & Google Research</strong><br>
                            Análise de 12.000+ casos de debug em projetos open source<br>
                            <em>Período: 18 meses de coleta de dados</em>
                        </p>
                    </div>
                </div>
            `,
            'ci-estudo': `
                <h2 class="expansion-title">⚡ Estudo: -67% Tempo de CI</h2>
                <p class="expansion-description">
                    Pesquisa da Stanford University e Microsoft (2024) sobre otimização de pipelines 
                    CI/CD usando IA para seleção inteligente de testes.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Impacto Medido
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>67% redução</strong> no tempo total de build<br>
                            • <strong>89% menos testes</strong> executados sem perder cobertura<br>
                            • <strong>74% redução</strong> em builds quebrados<br>
                            • <strong>91% precisão</strong> na predição de impacto
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 5H7C6.44772 5 6 5.44772 6 6V18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18V6C18 5.44772 17.5523 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Detalhes do Estudo
                        </h3>
                        <p class="expansion-detail-text">
                            <strong>Stanford University & Microsoft Research</strong><br>
                            "Intelligent Test Selection for Modern CI/CD" (2024)<br>
                            <em>Análise de 2.300+ repositórios do GitHub</em>
                        </p>
                    </div>
                </div>
            `,
            'github-copilot': `
                <h2 class="expansion-title">🐙 GitHub Copilot</h2>
                <p class="expansion-description">
                    O assistente de código mais integrado do mercado. Funciona diretamente no VS Code 
                    e oferece sugestões contextuais em tempo real.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4H8M16 4V2C16 1.44772 15.5523 1 15 1H9C8.44772 1 8 1.44772 8 2V4M16 4H8" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Quando Usar
                        </h3>
                        <p class="expansion-detail-text">
                            <code>// Criar testes Robot Framework<br>
                            *** Test Cases ***<br>
                            Validar Login Usuario<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;[Documentation]&nbsp;&nbsp;&nbsp;&nbsp;Teste login válido<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;Input Text&nbsp;&nbsp;&nbsp;&nbsp;id=username&nbsp;&nbsp;&nbsp;&nbsp;admin</code><br><br>
                            • Autocompletar código de testes<br>
                            • Gerar casos de teste automatizados<br>
                            • Criar Page Objects rapidamente
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Vantagens
                        </h3>
                        <p class="expansion-detail-text">
                            ✅ <strong>Integração nativa</strong> com IDE<br>
                            ✅ <strong>Contexto completo</strong> do projeto<br>
                            ✅ <strong>Sugestões em tempo real</strong><br>
                            ✅ <strong>Aprende com seu código</strong>
                        </p>
                    </div>
                </div>
            `,
            'google-gemini': `
                <h2 class="expansion-title">✨ Google Gemini</h2>
                <p class="expansion-description">
                    IA multimodal que analisa imagens, documentos e código simultaneamente. 
                    Essencial para análise de qualidade em múltiplas dimensões.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                                <path d="M21 15L16 10L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Casos de Uso como QA
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>Análise de UX</strong> - Screenshots de interfaces<br>
                            • <strong>Revisão de requisitos</strong> - PDFs e documentos<br>
                            • <strong>Testes exploratórios</strong> - Logs e evidencias<br>
                            • <strong>Compliance</strong> - Verificar padrões visuais<br>
                            • <strong>Acessibilidade</strong> - Detectar problemas de contraste<br>
                            • <strong>Relatórios</strong> - Interpretar métricas e gráficos
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Super Poder
                        </h3>
                        <p class="expansion-detail-text">
                            🎯 <strong>Visão + Texto</strong><br>
                            "Analise este screenshot e me diga o que está errado no layout"<br>
                            <em>→ Identifica desalinhamentos, cores incorretas, elementos sobrepostos</em>
                        </p>
                    </div>
                </div>
            `,
            'claude-sonnet': `
                <h2 class="expansion-title">🎯 Claude Sonnet</h2>
                <p class="expansion-description">
                    A IA com melhor capacidade de raciocínio lógico. Excelente para estratégias de teste 
                    complexas e análise detalhada de requisitos.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Especialidades
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>Planos de teste</strong> detalhados<br>
                            • <strong>Análise de cobertura</strong> completa<br>
                            • <strong>Estratégias de automação</strong><br>
                            • <strong>Cenários edge cases</strong><br>
                            • <strong>Revisão de arquitetura</strong> de testes
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 6.253V12L16 14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Melhor Para
                        </h3>
                        <p class="expansion-detail-text">
                            🧠 <strong>Pensamento crítico</strong><br>
                            Quando você precisa de análise profunda e não apenas código rápido<br>
                            <em>Exemplo: "Como testar um sistema de pagamento com 15 integrações?"</em>
                        </p>
                    </div>
                </div>
            `,
            'chatgpt': `
                <h2 class="expansion-title">🤖 ChatGPT</h2>
                <p class="expansion-description">
                    O pioneiro em conversação natural. Ideal para processos de qualidade, 
                    gestão de equipe e desenvolvimento profissional como QA.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 12H16M8 16H16M8 8H16M6 20H18C18.5523 20 19 19.5523 19 19V5C19 4.44772 18.5523 4 18 4H6C5.44772 4 5 4.44772 5 5V19C5 19.5523 5.44772 6 6 20Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Áreas de QA
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>Gestão de qualidade</strong> - Processos e métricas<br>
                            • <strong>Planos de teste</strong> - Estruturação completa<br>
                            • <strong>Treinamento QA</strong> - Material didático<br>
                            • <strong>Análise de risco</strong> - Identificação e mitigação<br>
                            • <strong>Comunicação</strong> - Reports para stakeholders<br>
                            • <strong>Melhoria contínua</strong> - Retrospectivas e ações
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.663 17H4.673M12 3V1M6.364 1.636L-.707.707M21 12H-1M4 12H3M3.343-5.657L-.707-.707M2.828 9.9A5 5 0 117.072 0L-.548.547A3.374 3.374 0 0014 18.469V19A2 2 0 11-4 0V-.531C0-.895-.356-1.754-.988-2.386L-.548-.547Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Quando Usar
                        </h3>
                        <p class="expansion-detail-text">
                            💡 <strong>Aprender algo novo</strong><br>
                            "Explique como funciona teste de carga como se eu fosse iniciante"<br>
                            <em>→ Respostas didáticas e estruturadas</em>
                        </p>
                    </div>
                </div>
            `,
            'cursor-ai': `
                <h2 class="expansion-title">⚡ Cursor AI</h2>
                <p class="expansion-description">
                    IDE com IA nativa. Combina o melhor do VS Code com capacidades de IA avançadas 
                    para edição contextual e refatoração inteligente.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2"/>
                                <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Recursos Únicos
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>Edição com Cmd+K</strong><br>
                            • <strong>Chat com contexto</strong> do projeto<br>
                            • <strong>Refatoração automática</strong><br>
                            • <strong>Geração de testes</strong> contextual<br>
                            • <strong>Composer para mudanças</strong> grandes
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 4H18C18.5523 4 19 4.44772 19 5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4H8M16 4V2C16 1.44772 15.5523 1 15 1H9C8.44772 1 8 1.44772 8 2V4M16 4H8" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Diferencial
                        </h3>
                        <p class="expansion-detail-text">
                            🎯 <strong>IDE + IA = Fluxo perfeito</strong><br>
                            Selecione código → Cmd+K → "converta para Page Object"<br>
                            <em>→ Refatora instantaneamente com contexto completo</em>
                        </p>
                    </div>
                </div>
            `,
            'perplexity-ai': `
                <h2 class="expansion-title">🔍 Perplexity AI</h2>
                <p class="expansion-description">
                    Mecanismo de busca com IA que fornece respostas com fontes verificadas. 
                    Essencial para pesquisa em qualidade de software e gestão de QA.
                </p>
                <div class="expansion-details">
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Pesquisas na área de QA
                        </h3>
                        <p class="expansion-detail-text">
                            • <strong>Frameworks de qualidade</strong> - ISO, CMMI, TMMi<br>
                            • <strong>Metodologias ágeis</strong> - Scrum, Kanban para QA<br>
                            • <strong>Ferramentas emergentes</strong> - IA em testes<br>
                            • <strong>Compliance</strong> - LGPD, SOX, GDPR<br>
                            • <strong>Métricas de qualidade</strong> - Industry benchmarks<br>
                            • <strong>Career path QA</strong> - Tendências de mercado
                        </p>
                    </div>
                    <div class="expansion-detail-item">
                        <h3 class="expansion-detail-title">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.828 14.828L21 21M16.5 10.5C16.5 6.35786 13.1421 3 9 3C4.85786 3 1.5 6.35786 1.5 10.5C1.5 14.6421 4.85786 18 9 18C13.1421 18 16.5 14.6421 16.5 10.5Z" stroke="currentColor" stroke-width="2"/>
                            </svg>
                            Vantagem Única
                        </h3>
                        <p class="expansion-detail-text">
                            📚 <strong>Fontes confiáveis sempre</strong><br>
                            "Quais as melhores práticas para testes de API em 2024?"<br>
                            <em>→ Resposta + links para estudos, artigos e documentação oficial</em>
                        </p>
                    </div>
                </div>
            `
        };

        return contents[type] || '<p>Conteúdo não encontrado</p>';
    }
}

// ===== EXPORTAR PARA USO GLOBAL =====
window.AnimationManager = AnimationManager;
window.SlideshowManager = SlideshowManager;
window.CardManager = CardManager;
window.Utils = Utils;
window.ExpansionSystem = ExpansionSystem;

// ExpansionSystem inicializado na função DOMContentLoaded principal