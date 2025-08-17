'use client';

type FamilyType = {
    key:
        | 'nuclear'
        | 'reconstituida'
        | 'monoparental'
        | 'avuncular'
        | 'abuelos'
        | 'mismo_sexo';
    titulo: string;       // título grande de la tarjeta
    subtitulo: string;    // subtítulo elegante
    colorClass: string;   // clase pastel distinta por tarjeta
    bullets?: string[];   // puntos opcionales
};

const TYPES: FamilyType[] = [
    {
        key: 'nuclear',
        titulo: 'Matrimonio',
        subtitulo: 'Padre, madre e hijos',
        colorClass: 'pastel-rose',
    },
    {
        key: 'reconstituida',
        titulo: 'Reconstituida',
        subtitulo: 'Matrimonio o unión libre con padrastro/madrastra e hijastros',
        colorClass: 'pastel-lilac',
    },
    {
        key: 'monoparental',
        titulo: 'Monoparental',
        subtitulo: 'Padre o madre soltero(a) con sus hijos',
        colorClass: 'pastel-sky',
    },
    {
        key: 'avuncular',
        titulo: 'Avuncular',
        subtitulo: 'Tíos o tías criando sobrinos',
        colorClass: 'pastel-mint',
    },
    {
        key: 'abuelos',
        titulo: 'Abuelos cuidadores',
        subtitulo: 'Abuelos criando nietos',
        colorClass: 'pastel-sand',
    },
    {
        key: 'mismo_sexo',
        titulo: 'Pareja del mismo sexo',
        subtitulo: 'Pareja del mismo sexo criando niños',
        colorClass: 'pastel-peach',
    },
];

export default function CaracterizacionFamiliarPage() {
    return (
        <main className="family-wrap">
            <section className="form-card" aria-label="Caracterización de familias (informativo)">
                {/* Reutilizamos el encabezado con logo */}
                <header className="form-card__header header-with-brand">
                    <div className="brand-plate" aria-hidden="true">
                        <img className="brand-logo" src="/branding/familia-logo.png" alt="Logo familiar" />
                    </div>
                    <div className="titles">
                        <h1 className="form-title">CARACTERIZACIÓN DE FAMILIAS</h1>

                    </div>
                </header>

                {/* Cuadrícula de tarjetas informativas */}
                <div className="info-grid">
                    {TYPES.map((t, idx) => (
                        <article key={t.key} className={`info-card ${t.colorClass}`} aria-label={t.titulo}>
                            <div className="info-card__header">
                                <span className="info-chip">Tipo {String(idx + 1).padStart(2, '0')}</span>
                                <h3 className="info-title">{t.titulo}</h3>
                                <p className="info-sub">{t.subtitulo}</p>
                            </div>

                            {t.bullets && t.bullets.length > 0 && (
                                <ul className="info-list">
                                    {t.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                </ul>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
