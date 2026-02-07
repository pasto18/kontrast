// src/scripts/animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
    
    // 1. ANIMACIÓN DE ENTRADA (Textos)
    const elements = document.querySelectorAll('.anim-left');
    elements.forEach((element) => {
        gsap.from(element, {
            x: -100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
            }
        });
    });

    // 2. VIDEO SCRUBBING (Corregido)
    const videos = document.querySelectorAll('video.video-scroll');

    videos.forEach((video) => {
        // Función que crea la animación
        const crearAnimacion = () => {
            // Nos aseguramos de que esté pausado para que no pelee con el scroll
            video.pause();
            
            gsap.fromTo(video, 
                { currentTime: 0 }, 
                { 
                    currentTime: video.duration || 1, // Evita NaN si duration no está disponible
                    duration: 1, // Duración de la animación (no afecta al scrub)
                    ease: "none",
                    scrollTrigger: {
                        trigger: video,
                        start: "top bottom", // Empieza al entrar por abajo
                        end: "bottom 100%",   // Acaba al salir por arriba
                        scrub: 0.5,          // Un poco de suavizado (0.5s)
                        markers: true     // DESCOMENTA ESTO SI SIGUE FALLANDO PARA VER LAS MARCAS
                    }
                }
            );
        };

        // LÓGICA DE SEGURIDAD:
        // ¿El video ya cargó los metadatos (duración) antes de llegar aquí?
        if (video.readyState >= 1) {
            crearAnimacion(); // Sí -> Anima directamente
        } else {
            video.addEventListener('loadedmetadata', crearAnimacion); // No -> Espera al evento
        }
    });
}