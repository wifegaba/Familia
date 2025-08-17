'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Users, Cog } from 'lucide-react';
import './MenuPrincipal.css';




export interface MenuPrincipalProps {
  /** Si la pasas, se ejecuta al pulsar “Administrador”. */
  onRegistrarEstudiante?: () => void;
}

const MenuPrincipal: React.FC<MenuPrincipalProps> = ({ onRegistrarEstudiante }) => {
  const router = useRouter();
  const [showDev, setShowDev] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // ✅ Ir directo a la PRIMERA opción del sidebar
  const goAdministrador = () => {
    if (onRegistrarEstudiante) onRegistrarEstudiante();
    router.push('/Familias/Formulario');
  };

  // Accesible con Enter/Espacio
  const keyActivate =
      (fn: () => void) =>
          (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fn();
            }
          };

  // Overlay: Escape para cerrar y foco al botón
  useEffect(() => {
    if (!showDev) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowDev(false); };
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [showDev]);

  return (
      <>
        <div className="pantalla">
          {/* Logo estampado + título */}
          <section className="panel-logo">
            <div className="brand-plate" aria-hidden="true">
              <img src="/branding/familia-logo.png" alt="Logo" className="logo-stamp" />
            </div>
            <h1 className="landing-title">Uniendo Corazones</h1>
          </section>

          {/* Dock de vidrio con tarjetas tipo mac 2025 */}
          <section className="dock">
            <div
                className="glass-card admin"
                role="button"
                tabIndex={0}
                onClick={goAdministrador}
                onKeyDown={keyActivate(goAdministrador)}
                aria-label="Abrir panel Administrador"
            >
              <div className="glass-left">
                <div className="accent-circle admin-accent">
                  <ShieldCheck size={32} aria-hidden />
                </div>
              </div>
              <div className="glass-right">
                <h2>Administrador</h2>
                <p>Gestión, reportes y configuración del sistema.</p>
              </div>
            </div>

            <div
                className="glass-card users"
                role="button"
                tabIndex={0}
                onClick={() => setShowDev(true)}
                onKeyDown={keyActivate(() => setShowDev(true))}
                aria-label="Sección Usuarios en desarrollo"
            >
              <div className="glass-left">
                <div className="accent-circle users-accent">
                  <Users size={32} aria-hidden />
                </div>
              </div>
              <div className="glass-right">
                <h2>Usuarios</h2>
                <p>Acceso de usuarios finales y su área personal.</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="creditos">
            <p>Designed <strong>WFSYSTEM S.I</strong></p>
          </footer>
        </div>

        {/* Overlay En desarrollo (glass) */}
        {showDev && (
            <div
                className="dev-overlay"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dev-title"
                aria-describedby="dev-desc"
                onClick={() => setShowDev(false)}
            >
              <div className="dev-card" onClick={(e) => e.stopPropagation()}>
                <Cog className="dev-gear spin" size={72} aria-hidden />
                <div id="dev-title" className="dev-title">En desarrollo</div>
                <p id="dev-desc" className="dev-desc">Esta sección estará disponible pronto.</p>
                <button
                    ref={closeBtnRef}
                    className="dev-btn"
                    onClick={() => setShowDev(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
        )}
      </>
  );
};

export default MenuPrincipal;
