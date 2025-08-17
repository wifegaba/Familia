'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, Sprout, UserPlus, LogOut } from 'lucide-react';
import './MenuEstudiantes.css';

type Item = {
    label: string;
    href: string;
    Icon: LucideIcon;
};

export default function MenuEstudiantes() {
    const path = usePathname() || '/';

    const items: Item[] = [
        { label: 'Nuevo Registro',  href: '/Familias/Formulario', Icon: UserPlus },
        { label: 'Caracterizacion', href: '/Familias',            Icon: Sprout  },
        { label: 'Salir',           href: '/',                    Icon: LogOut  },
    ];

    // Normaliza ruta y calcula profundidad (/a/b => 2)
    const normalize = (s: string) => (s.split('?')[0].replace(/\/+$/, '') || '/');
    const depth = (s: string) => normalize(s).split('/').filter(Boolean).length;

    // ✅ Activo: exacto, o prefijo solo si el ítem tiene profundidad >= 2
    const isActive = (href: string) => {
        const clean = normalize(path);
        const test  = normalize(href);
        if (clean === test) return true;
        return depth(test) >= 2 && clean.startsWith(test + '/');
    };

    return (
        <aside className="menu-estudiantes__sidebar">
            {items.map(({ label, href, Icon }) => {
                const active = isActive(href);
                const itemClass = active
                    ? 'menu-estudiantes__item menu-estudiantes__item--active'
                    : 'menu-estudiantes__item';

                return (
                    <Link
                        key={href}
                        href={href}
                        className={itemClass}
                        aria-current={active ? 'page' : undefined}
                        prefetch
                    >
                        <Icon className="menu-estudiantes__icon" aria-hidden />
                        <span className="menu-estudiantes__label">{label}</span>
                    </Link>
                );
            })}
        </aside>
    );
}
