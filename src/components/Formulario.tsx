'use client';

import { useEffect, useMemo, useState } from 'react';


/** Llaves (amigo -> otro) */
type MemberKey =
    | 'abuelos' | 'papa' | 'mama' | 'hijos' | 'mascotas' | 'otro'
    | 'religion' | 'practicas_familia' | 'perdidas_familiares'
    | 'divorcio' | 'padrasto_madrastra' | 'red_apoyo';

type Answer = 'si' | 'no' | null;

type MemberConfig = { key: MemberKey; label: string; img: string };

type EstadoCivil = 'soltero' | 'casado' | 'union_libre' | 'divorciado';
type Presencia   = 'presente' | 'ausente';
type ViveCon     = 'papa' | 'mama' | 'ambos';
type Genero      = 'Masculino' | 'Femenino' | 'Otro';

type MascotaTipo =
    | 'Perro' | 'Gato' | 'Ave' | 'Pez' | 'Hámster' | 'Conejo' | 'Tortuga'
    | 'Reptil' | 'Cerdo mini' | 'Hurón' | 'Caballo' | 'Otro';

/** Detalles por tarjeta */
type MemberDetails = {
    nombre?: string;
    tipoMascota?: string;

    // Personas extendidas
    nombreCompleto?: string;
    edad?: number;
    telefono?: string;
    cedula?: string;
    profesion?: string;
    meDedicoA?: string;
    tiempoTrabajo?: string;
    ingresosMensuales?: number;
    egresosMensuales?: number;
    distribucion?: {
        vivienda?: number; alimentacion?: number; estudio?: number;
        salud?: number; recreacion?: number; otros?: number;
    };
    estadoCivil?: EstadoCivil;
    presencia?: Presencia;
    promedioTiempoFamilia?: string;
    nivelEscolaridad?: string;
    tieneDiscapacidad?: boolean;
    detalleDiscapacidad?: string;
    direccion?: string;
    ciudad?: string;
    objetivosFamilia?: string;

    // Hijos dinámico
    hijosData?: {
        cantidad: number;
        hijos: Array<{
            nombreCompleto?: string; documento?: string; edad?: number; telefono?: string;
            ciudad?: string; residencia?: string; viveCon?: ViveCon;
            tieneHermanos?: boolean; numeroHermanos?: number;
            gradoEscolaridad?: string; colegio?: string; calificacionColegio?: number;
            tiempoLibre?: string; ayudaTareas?: string; carreraGustaria?: string;
            tiempoEnFamilia?: string; amigosCercanos?: boolean; cuantosAmigos?: number;
            tiempoPantalla?: string; chequeosMedicos?: boolean;
            discapacidad?: boolean; detalleDiscapacidad?: string;
            comoSeSienteFamilia?: string;
        }>;
    };

    // Mascotas dinámico
    mascotasData?: {
        cantidad: number;
        mascotas: Array<{ nombre?: string; tipo?: MascotaTipo; tipoOtro?: string }>;
    };

    // ► “Otro”
    otroData?: {
        sexo?: Genero;
        parentesco?: string;
        nombre?: string;
        edad?: number;
        tieneHijos?: boolean;
        cuantosHijos?: number;
        tiempoEnCasa?: string;
        trabajaOEstudia?: string;
    };
};

/** Residencia (nueva puerta de entrada) */
type ZonaKey = 'urbana' | 'rural';
type Residencia = {
    zona?: ZonaKey;
    ciudadVereda?: string;
    direccion?: string;
    tipoVivienda?: string;
};

const EXTENDED_KEYS: MemberKey[] = ['papa', 'mama', 'abuelos', 'padrasto_madrastra'];

const MEMBERS: MemberConfig[] = [
    { key: 'abuelos',  label: 'Abuelos',  img: '/familia/abuelos.png' },
    { key: 'papa',     label: 'Papá',     img: '/familia/Papa y Mama.png' },
    { key: 'mama',     label: 'Mamá',     img: '/familia/mama.png' },
    { key: 'hijos',    label: 'Hijos',    img: '/familia/hijos.png' },
    { key: 'mascotas', label: 'Mascotas', img: '/familia/Mascotas.png' },
    { key: 'otro',     label: 'Otro',     img: '/familia/amigo.png' },
    { key: 'religion',            label: 'Religión',             img: '/familia/religion.png' },
    { key: 'practicas_familia',   label: 'Prácticas en Familia', img: '/familia/practicasfamilia.png' },
    { key: 'perdidas_familiares', label: 'Pérdidas Familiares',  img: '/familia/perdidas.png' },
    { key: 'divorcio',            label: 'Divorcio',             img: '/familia/divorcio.png' },
    { key: 'padrasto_madrastra',  label: 'Padrastro - Madrastra',img: '/familia/padrasto-madrastra.png' },
    { key: 'red_apoyo',           label: 'Red de Apoyo',         img: '/familia/redapoyo.png' },
];

/** Iconos inline (SVG) para urbana/rural sin tocar tu CSS */
const ICON_URB = '/familia/urbana.png';
const ICON_RUR = '/familia/rural.png';

export default function FamilyPage() {
    const [answers, setAnswers] = useState<Record<MemberKey, Answer>>({
        abuelos: null, papa: null, mama: null, hijos: null, mascotas: null, otro: null,
        religion: null, practicas_familia: null, perdidas_familiares: null,
        divorcio: null, padrasto_madrastra: null, red_apoyo: null,
    });

    const [details, setDetails] = useState<Record<MemberKey, MemberDetails>>({
        abuelos: {}, papa: {}, mama: {}, hijos: {}, mascotas: {}, otro: {},
        religion: {}, practicas_familia: {}, perdidas_familiares: {},
        divorcio: {}, padrasto_madrastra: {}, red_apoyo: {},
    });

    /** ========= PUERTA DE RESIDENCIA ========= */
    const [showResidenciaGate, setShowResidenciaGate] = useState<boolean>(true);
    const [resAnimIn, setResAnimIn] = useState<boolean>(false);
    const [resAnswers, setResAnswers] = useState<Record<ZonaKey, Answer>>({
        urbana: null, rural: null,
    });
    const [resForm, setResForm] = useState<Residencia>({});
    const [residencia, setResidencia] = useState<Residencia>({});

    useEffect(() => {
        if (showResidenciaGate) {
            const t = setTimeout(() => setResAnimIn(true), 0);
            return () => clearTimeout(t);
        }
    }, [showResidenciaGate]);

    const selectZona = (zona: ZonaKey, val: Answer) => {
        if (val === 'si') {
            setResAnswers({ urbana: zona === 'urbana' ? 'si' : 'no', rural: zona === 'rural' ? 'si' : 'no' });
            setResForm(f => ({ zona, ciudadVereda: f.ciudadVereda ?? '', direccion: f.direccion ?? '', tipoVivienda: f.tipoVivienda ?? '' }));
        } else {
            setResAnswers(a => ({ ...a, [zona]: 'no' }));
            setResForm(f => ({ ...f, zona: (zona === f.zona ? undefined : f.zona) }));
        }
    };

    const saveResidencia = () => {
        if (resAnswers.urbana !== 'si' && resAnswers.rural !== 'si') {
            alert('Selecciona una zona (Urbana o Rural) y marca "Sí".');
            return;
        }
        if (!resForm.zona) {
            alert('Falta la zona seleccionada.');
            return;
        }
        if (!resForm.ciudadVereda?.trim() || !resForm.direccion?.trim() || !resForm.tipoVivienda?.trim()) {
            alert('Completa Ciudad/Vereda, Dirección y Tipo de vivienda.');
            return;
        }
        setResidencia({
            zona: resForm.zona,
            ciudadVereda: resForm.ciudadVereda.trim(),
            direccion: resForm.direccion.trim(),
            tipoVivienda: resForm.tipoVivienda.trim(),
        });
        setResAnimIn(false);
        setTimeout(() => setShowResidenciaGate(false), 250);
    };

    /** ========= MODALES EXISTENTES ========= */

    const [modalFor, setModalFor] = useState<MemberKey | null>(null);

    const [tmpNombre, setTmpNombre] = useState('');
    const [tmpTipo, setTmpTipo] = useState('');

    type PersonModal = {
        nombreCompleto: string; edad: string; telefono: string; cedula: string; profesion: string;
        meDedicoA: string; tiempoTrabajo: string;
        ingresosMensuales: string; egresosMensuales: string;
        distribucion: { vivienda: string; alimentacion: string; estudio: string; salud: string; recreacion: string; otros: string; };
        estadoCivil: EstadoCivil | ''; presencia: Presencia | '';
        promedioTiempoFamilia: string; nivelEscolaridad: string;
        tieneDiscapacidad: 'si' | 'no' | ''; detalleDiscapacidad: string;
        direccion: string; ciudad: string; objetivosFamilia: string;
    };
    const blankPerson: PersonModal = {
        nombreCompleto: '', edad: '', telefono: '', cedula: '', profesion: '',
        meDedicoA: '', tiempoTrabajo: '',
        ingresosMensuales: '', egresosMensuales: '',
        distribucion: { vivienda: '', alimentacion: '', estudio: '', salud: '', recreacion: '', otros: '' },
        estadoCivil: '', presencia: '', promedioTiempoFamilia: '', nivelEscolaridad: '',
        tieneDiscapacidad: '', detalleDiscapacidad: '', direccion: '', ciudad: '', objetivosFamilia: '',
    };
    const [tmpPerson, setTmpPerson] = useState<PersonModal>(blankPerson);

    type HijoModal = {
        cantidad: string;
        hijos: Array<{
            nombreCompleto: string; documento: string; edad: string; telefono: string;
            ciudad: string; residencia: string; viveCon: ViveCon | '';
            tieneHermanos: 'si' | 'no' | ''; numeroHermanos: string;
            gradoEscolaridad: string; colegio: string; calificacionColegio: string;
            tiempoLibre: string; ayudaTareas: string; carreraGustaria: string;
            tiempoEnFamilia: string; amigosCercanos: 'si' | 'no' | ''; cuantosAmigos: string;
            tiempoPantalla: string; chequeosMedicos: 'si' | 'no' | '';
            discapacidad: 'si' | 'no' | ''; detalleDiscapacidad: string;
            comoSeSienteFamilia: string;
        }>;
    };
    const blankChild = (): HijoModal['hijos'][number] => ({
        nombreCompleto: '', documento: '', edad: '', telefono: '',
        ciudad: '', residencia: '', viveCon: '',
        tieneHermanos: '', numeroHermanos: '',
        gradoEscolaridad: '', colegio: '', calificacionColegio: '',
        tiempoLibre: '', ayudaTareas: '', carreraGustaria: '', tiempoEnFamilia: '',
        amigosCercanos: '', cuantosAmigos: '', tiempoPantalla: '',
        chequeosMedicos: '', discapacidad: '', detalleDiscapacidad: '',
        comoSeSienteFamilia: '',
    });
    const [tmpHijos, setTmpHijos] = useState<HijoModal>({ cantidad: '', hijos: [] });

    type MascotaModal = { cantidad: string; mascotas: Array<{ nombre: string; tipo: MascotaTipo | ''; tipoOtro: string }> };
    const blankPet = (): MascotaModal['mascotas'][number] => ({ nombre: '', tipo: '', tipoOtro: '' });
    const [tmpMascotas, setTmpMascotas] = useState<MascotaModal>({ cantidad: '', mascotas: [] });
    const PET_TYPES: MascotaTipo[] = ['Perro','Gato','Ave','Pez','Hámster','Conejo','Tortuga','Reptil','Cerdo mini','Hurón','Caballo','Otro'];

    type OtroModal = {
        sexo: Genero | '';
        parentesco: string;
        nombre: string;
        edad: string;
        tieneHijos: 'si' | 'no' | '';
        cuantosHijos: string;
        tiempoEnCasa: string;
        trabajaOEstudia: string;
    };
    const [tmpOtro, setTmpOtro] = useState<OtroModal>({
        sexo: '', parentesco: '', nombre: '', edad: '',
        tieneHijos: '', cuantosHijos: '', tiempoEnCasa: '', trabajaOEstudia: ''
    });

    const modalPlaceholder = (k: MemberKey): string => {
        switch (k) {
            case 'religion': return 'Ej. Católica / Evangélica';
            case 'practicas_familia': return 'Ej. Orar juntos, juegos, salidas';
            case 'perdidas_familiares': return 'Ej. Abuelo (2022)';
            case 'divorcio': return 'Ej. En proceso / Finalizado';
            case 'padrasto_madrastra': return 'Ej. Sí, desde 2021';
            case 'red_apoyo': return 'Ej. Abuelos / Iglesia / Amigos';
            default: return 'Escribe el detalle';
        }
    };

    const openModalFor = (key: MemberKey) => {
        setModalFor(key);
        setTmpNombre(details[key].nombre ?? '');
        setTmpTipo(details[key].tipoMascota ?? '');

        if (EXTENDED_KEYS.includes(key)) {
            const s = details[key] || {};
            setTmpPerson({
                nombreCompleto: s.nombreCompleto ?? s.nombre ?? '',
                edad: s.edad != null ? String(s.edad) : '',
                telefono: s.telefono ?? '', cedula: s.cedula ?? '',
                profesion: s.profesion ?? '', meDedicoA: s.meDedicoA ?? '', tiempoTrabajo: s.tiempoTrabajo ?? '',
                ingresosMensuales: s.ingresosMensuales != null ? String(s.ingresosMensuales) : '',
                egresosMensuales: s.egresosMensuales != null ? String(s.egresosMensuales) : '',
                distribucion: {
                    vivienda: s.distribucion?.vivienda != null ? String(s.distribucion?.vivienda) : '',
                    alimentacion: s.distribucion?.alimentacion != null ? String(s.distribucion?.alimentacion) : '',
                    estudio: s.distribucion?.estudio != null ? String(s.distribucion?.estudio) : '',
                    salud: s.distribucion?.salud != null ? String(s.distribucion?.salud) : '',
                    recreacion: s.distribucion?.recreacion != null ? String(s.distribucion?.recreacion) : '',
                    otros: s.distribucion?.otros != null ? String(s.distribucion?.otros) : '',
                },
                estadoCivil: s.estadoCivil ?? '', presencia: s.presencia ?? '', promedioTiempoFamilia: s.promedioTiempoFamilia ?? '',
                nivelEscolaridad: s.nivelEscolaridad ?? '', tieneDiscapacidad: s.tieneDiscapacidad == null ? '' : (s.tieneDiscapacidad ? 'si' : 'no'),
                detalleDiscapacidad: s.detalleDiscapacidad ?? '', direccion: s.direccion ?? '', ciudad: s.ciudad ?? '',
                objetivosFamilia: s.objetivosFamilia ?? '',
            });
        }

        if (key === 'hijos') {
            const src = details.hijos?.hijosData;
            if (src) {
                setTmpHijos({
                    cantidad: String(src.cantidad),
                    hijos: src.hijos.map(h => ({
                        nombreCompleto: h.nombreCompleto ?? '', documento: h.documento ?? '',
                        edad: h.edad != null ? String(h.edad) : '', telefono: h.telefono ?? '',
                        ciudad: h.ciudad ?? '', residencia: h.residencia ?? '', viveCon: h.viveCon ?? '',
                        tieneHermanos: h.tieneHermanos == null ? '' : (h.tieneHermanos ? 'si' : 'no'),
                        numeroHermanos: h.numeroHermanos != null ? String(h.numeroHermanos) : '',
                        gradoEscolaridad: h.gradoEscolaridad ?? '', colegio: h.colegio ?? '',
                        calificacionColegio: h.calificacionColegio != null ? String(h.calificacionColegio) : '',
                        tiempoLibre: h.tiempoLibre ?? '', ayudaTareas: h.ayudaTareas ?? '',
                        carreraGustaria: h.carreraGustaria ?? '', tiempoEnFamilia: h.tiempoEnFamilia ?? '',
                        amigosCercanos: h.amigosCercanos == null ? '' : (h.amigosCercanos ? 'si' : 'no'),
                        cuantosAmigos: h.cuantosAmigos != null ? String(h.cuantosAmigos) : '',
                        tiempoPantalla: h.tiempoPantalla ?? '', chequeosMedicos: h.chequeosMedicos == null ? '' : (h.chequeosMedicos ? 'si' : 'no'),
                        discapacidad: h.discapacidad == null ? '' : (h.discapacidad ? 'si' : 'no'),
                        detalleDiscapacidad: h.detalleDiscapacidad ?? '',
                        comoSeSienteFamilia: h.comoSeSienteFamilia ?? '',
                    })),
                });
            } else setTmpHijos({ cantidad: '', hijos: [] });
        }

        if (key === 'mascotas') {
            const src = details.mascotas?.mascotasData;
            if (src) {
                setTmpMascotas({
                    cantidad: String(src.cantidad),
                    mascotas: src.mascotas.map(m => ({
                        nombre: m.nombre ?? '', tipo: (m.tipo ?? '') as MascotaTipo | '', tipoOtro: m.tipoOtro ?? '',
                    })),
                });
            } else setTmpMascotas({ cantidad: '', mascotas: [] });
        }

        if (key === 'otro') {
            const o = details.otro?.otroData;
            setTmpOtro({
                sexo: (o?.sexo ?? '') as Genero | '',
                parentesco: o?.parentesco ?? '',
                nombre: o?.nombre ?? '',
                edad: o?.edad != null ? String(o.edad) : '',
                tieneHijos: o?.tieneHijos == null ? '' : (o.tieneHijos ? 'si' : 'no'),
                cuantosHijos: o?.cuantosHijos != null ? String(o.cuantosHijos) : '',
                tiempoEnCasa: o?.tiempoEnCasa ?? '',
                trabajaOEstudia: o?.trabajaOEstudia ?? '',
            });
        }
    };

    const closeModal = () => {
        setModalFor(null);
        setTmpNombre(''); setTmpTipo('');
        setTmpPerson(blankPerson);
        setTmpHijos({ cantidad: '', hijos: [] });
        setTmpMascotas({ cantidad: '', mascotas: [] });
        setTmpOtro({
            sexo: '', parentesco: '', nombre: '', edad: '',
            tieneHijos: '', cuantosHijos: '', tiempoEnCasa: '', trabajaOEstudia: ''
        });
    };

    const onSelect = (key: MemberKey, value: Answer) => {
        if (value === 'si') { setAnswers(p => ({ ...p, [key]: 'si' })); openModalFor(key); }
        else { setAnswers(p => ({ ...p, [key]: 'no' })); setDetails(p => ({ ...p, [key]: {} })); }
    };

    const setCantidadHijos = (raw: string) => {
        const n = Math.max(0, Math.min(10, Number(raw.replace(/\D/g, '') || '')));
        const next = { ...tmpHijos, cantidad: n ? String(n) : '' };
        const curr = tmpHijos.hijos.length;
        next.hijos = n > curr ? [...tmpHijos.hijos, ...Array.from({ length: n - curr }, blankChild)] : tmpHijos.hijos.slice(0, n);
        setTmpHijos(next);
    };
    const setCantidadMascotas = (raw: string) => {
        const n = Math.max(0, Math.min(12, Number(raw.replace(/\D/g, '') || '')));
        const next = { ...tmpMascotas, cantidad: n ? String(n) : '' };
        const curr = tmpMascotas.mascotas.length;
        next.mascotas = n > curr ? [...tmpMascotas.mascotas, ...Array.from({ length: n - curr }, blankPet)] : tmpMascotas.mascotas.slice(0, n);
        setTmpMascotas(next);
    };

    const saveModal = () => {
        if (!modalFor) return;

        if (EXTENDED_KEYS.includes(modalFor)) {
            if (!tmpPerson.nombreCompleto.trim()) { alert('Ingresa el nombre completo.'); return; }
            const num = (v: string) => (v.trim() === '' ? undefined : Number(v));
            const d: MemberDetails = {
                nombre: tmpPerson.nombreCompleto.trim(),
                nombreCompleto: tmpPerson.nombreCompleto.trim(),
                edad: num(tmpPerson.edad), telefono: tmpPerson.telefono || undefined, cedula: tmpPerson.cedula || undefined,
                profesion: tmpPerson.profesion || undefined, meDedicoA: tmpPerson.meDedicoA || undefined,
                tiempoTrabajo: tmpPerson.tiempoTrabajo || undefined,
                ingresosMensuales: num(tmpPerson.ingresosMensuales), egresosMensuales: num(tmpPerson.egresosMensuales),
                distribucion: {
                    vivienda: num(tmpPerson.distribucion.vivienda), alimentacion: num(tmpPerson.distribucion.alimentacion),
                    estudio: num(tmpPerson.distribucion.estudio), salud: num(tmpPerson.distribucion.salud),
                    recreacion: num(tmpPerson.distribucion.recreacion), otros: num(tmpPerson.distribucion.otros),
                },
                estadoCivil: (tmpPerson.estadoCivil || undefined) as EstadoCivil | undefined,
                presencia: (tmpPerson.presencia || undefined) as Presencia | undefined,
                promedioTiempoFamilia: tmpPerson.promedioTiempoFamilia || undefined,
                nivelEscolaridad: tmpPerson.nivelEscolaridad || undefined,
                tieneDiscapacidad: tmpPerson.tieneDiscapacidad === '' ? undefined : tmpPerson.tieneDiscapacidad === 'si',
                detalleDiscapacidad: tmpPerson.detalleDiscapacidad || undefined,
                direccion: tmpPerson.direccion || undefined, ciudad: tmpPerson.ciudad || undefined,
                objetivosFamilia: tmpPerson.objetivosFamilia || undefined,
            };
            setDetails(p => ({ ...p, [modalFor]: d })); setAnswers(p => ({ ...p, [modalFor]: 'si' })); closeModal(); return;
        }

        if (modalFor === 'hijos') {
            const n = Number(tmpHijos.cantidad || 0); if (!n) { alert('Indica cuántos hijos.'); return; }
            for (let i = 0; i < n; i++) if (!tmpHijos.hijos[i]?.nombreCompleto?.trim()) { alert(`Ingresa el nombre del Hijo ${i + 1}.`); return; }
            const num = (v: string) => (v.trim() === '' ? undefined : Number(v));
            const b = (v: 'si' | 'no' | '') => (v === '' ? undefined : v === 'si');
            const hijos = tmpHijos.hijos.slice(0, n).map(h => ({
                nombreCompleto: h.nombreCompleto.trim(),
                documento: h.documento || undefined, edad: num(h.edad), telefono: h.telefono || undefined,
                ciudad: h.ciudad || undefined, residencia: h.residencia || undefined,
                viveCon: (h.viveCon || undefined) as ViveCon | undefined,
                tieneHermanos: b(h.tieneHermanos), numeroHermanos: num(h.numeroHermanos),
                gradoEscolaridad: h.gradoEscolaridad || undefined, colegio: h.colegio || undefined,
                calificacionColegio: num(h.calificacionColegio),
                tiempoLibre: h.tiempoLibre || undefined, ayudaTareas: h.ayudaTareas || undefined,
                carreraGustaria: h.carreraGustaria || undefined, tiempoEnFamilia: h.tiempoEnFamilia || undefined,
                amigosCercanos: b(h.amigosCercanos), cuantosAmigos: num(h.cuantosAmigos),
                tiempoPantalla: h.tiempoPantalla || undefined, chequeosMedicos: b(h.chequeosMedicos),
                discapacidad: b(h.discapacidad), detalleDiscapacidad: h.detalleDiscapacidad || undefined,
                comoSeSienteFamilia: h.comoSeSienteFamilia || undefined,
            }));
            setDetails(p => ({ ...p, hijos: { nombre: `${n} ${n === 1 ? 'hijo' : 'hijos'}`, hijosData: { cantidad: n, hijos } } }));
            setAnswers(p => ({ ...p, hijos: 'si' })); closeModal(); return;
        }

        if (modalFor === 'mascotas') {
            const n = Number(tmpMascotas.cantidad || 0); if (!n) { alert('Indica cuántas mascotas.'); return; }
            for (let i = 0; i < n; i++) {
                const m = tmpMascotas.mascotas[i];
                if (!m?.nombre?.trim()) { alert(`Ingresa el nombre de la Mascota ${i + 1}.`); return; }
                if (!m?.tipo) { alert(`Selecciona el tipo de la Mascota ${i + 1}.`); return; }
                if (m.tipo === 'Otro' && !m.tipoOtro.trim()) { alert(`Especifica el tipo de la Mascota ${i + 1}.`); return; }
            }
            const mascotas = tmpMascotas.mascotas.slice(0, n).map(m => ({
                nombre: m.nombre.trim(), tipo: m.tipo as MascotaTipo, tipoOtro: m.tipo === 'Otro' ? m.tipoOtro.trim() : undefined,
            }));
            setDetails(p => ({ ...p, mascotas: { nombre: `${n} ${n === 1 ? 'mascota' : 'mascotas'}`, mascotasData: { cantidad: n, mascotas } } }));
            setAnswers(p => ({ ...p, mascotas: 'si' })); closeModal(); return;
        }

        if (modalFor === 'otro') {
            if (!tmpOtro.nombre.trim()) { alert('Ingresa el nombre.'); return; }
            if (!tmpOtro.sexo)       { alert('Selecciona el sexo.'); return; }
            if (!tmpOtro.parentesco.trim()) { alert('Ingresa el parentesco.'); return; }

            const num = (v: string) => (v.trim() === '' ? undefined : Number(v));
            const d: MemberDetails = {
                nombre: tmpOtro.nombre.trim(),
                otroData: {
                    nombre: tmpOtro.nombre.trim(),
                    sexo: tmpOtro.sexo as Genero,
                    parentesco: tmpOtro.parentesco.trim(),
                    edad: num(tmpOtro.edad),
                    tieneHijos: tmpOtro.tieneHijos === '' ? undefined : tmpOtro.tieneHijos === 'si',
                    cuantosHijos: num(tmpOtro.cuantosHijos),
                    tiempoEnCasa: tmpOtro.tiempoEnCasa || undefined,
                    trabajaOEstudia: tmpOtro.trabajaOEstudia || undefined,
                }
            };
            setDetails(p => ({ ...p, otro: d }));
            setAnswers(p => ({ ...p, otro: 'si' }));
            closeModal();
            return;
        }

        if (tmpNombre.trim().length === 0) { alert('Ingresa un detalle.'); return; }
        setDetails(p => ({ ...p, [modalFor]: { nombre: tmpNombre.trim() } }));
        setAnswers(p => ({ ...p, [modalFor]: 'si' })); closeModal();
    };

    const cancelModal = () => {
        if (modalFor) {
            const had =
                Boolean(details[modalFor]?.nombre) ||
                Boolean(details[modalFor]?.nombreCompleto) ||
                Boolean(details.hijos?.hijosData) ||
                Boolean(details.mascotas?.mascotasData) ||
                Boolean(details.otro?.otroData);
            if (!had) setAnswers(p => ({ ...p, [modalFor]: null }));
        }
        closeModal();
    };

    const payload = useMemo(() => {
        const data: Record<string, unknown> = {};
        if (residencia.zona) data['residencia'] = residencia;
        for (const m of MEMBERS) if (answers[m.key] === 'si') data[m.key] = details[m.key];
        return data;
    }, [answers, details, residencia]);

    const currentMember = useMemo(
        () => (modalFor ? MEMBERS.find(m => m.key === modalFor) ?? null : null),
        [modalFor]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Payload listo para guardar:', payload);
        alert('Datos listos. Mira la consola para ver el payload.');
    };

    return (
        <main className="family-wrap">
            <section className="form-card" aria-label="Información Familiar">
                <header className="form-card__header header-with-brand">
                    <div className="brand-plate" aria-hidden="true">
                        <img className="brand-logo" src="/branding/familia-logo.png" alt="Logo familiar" />
                    </div>
                    <div className="titles">
                        <h1 className="form-title">INFORMACIÓN FAMILIAR</h1>
                        <p className="form-subtitle">Miembros que viven en casa</p>

                    </div>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="cards-grid">
                        {MEMBERS.map((m) => {
                            const selected = answers[m.key];
                            const badge =
                                details[m.key]?.nombre ??
                                details[m.key]?.nombreCompleto ??
                                details.otro?.otroData?.nombre;
                            return (
                                <article key={m.key} className="member-card" role="group" aria-label={m.label}>
                                    <div className="member-left">
                                        <img className="member-avatar" src={m.img} alt={m.label} />
                                        <div className="member-texts">
                                            <h3 className="member-title">{m.label}</h3>
                                            {answers[m.key] === 'si' && badge && (
                                                <div className="mini-badge" aria-live="polite">{badge}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="member-actions">
                                        <label className="radio-pill">
                                            <input type="radio" name={`opt-${m.key}`} value="si"
                                                   checked={selected === 'si'} onChange={() => onSelect(m.key, 'si')} />
                                            <span>Sí</span>
                                        </label>
                                        <label className="radio-pill">
                                            <input type="radio" name={`opt-${m.key}`} value="no"
                                                   checked={selected === 'no'} onChange={() => onSelect(m.key, 'no')} />
                                            <span>No</span>
                                        </label>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="btn-primary">Guardar</button>
                    </div>
                </form>
            </section>

            {/* ====== MODAL RESIDENCIA (bienvenida) ====== */}
            {showResidenciaGate && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div
                        className="modal-card"
                        style={{
                            width: 'min(1100px, 96vw)',
                            maxHeight: 'calc(100dvh - 40px)',
                            transform: resAnimIn ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.98)',
                            opacity: resAnimIn ? 1 : 0,
                            transition: 'transform 260ms cubic-bezier(.2,.8,.2,1), opacity 260ms',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-head">
                            <h4>Selecciona un lugar de residencia</h4>
                        </div>

                        {(() => {
                            // ¿Hay una zona seleccionada con "Sí"?
                            const sel: ZonaKey | null =
                                resAnswers.urbana === 'si' ? 'urbana' :
                                    resAnswers.rural === 'si'  ? 'rural'  : null;

                            // Vista 1: tarjetas grandes lado a lado (sin selección aún)
                            if (!sel) {
                                return (
                                    <div className="modal-body modal-body--scroll" style={{ paddingTop: 6 }}>
                                        <div style={{ display: 'flex', gap: 16 }}>
                                            {/* Zona urbana */}
                                            <article className="member-card" style={{ width: '50%', minHeight: 220 }}>
                                                <div className="member-left">
                                                    <img className="member-avatar" src={ICON_URB} alt="Zona urbana" style={{ width: 110, height: 110 }} />
                                                    <div className="member-texts">
                                                        <h3 className="member-title" style={{ fontSize: 22 }}>Zona urbana</h3>
                                                        <small className="form-hint">Barrios, conjuntos, apartamentos</small>
                                                    </div>
                                                </div>
                                                <div className="member-actions">
                                                    <label className="radio-pill">
                                                        <input
                                                            type="radio"
                                                            name="zona-urb"
                                                            checked={resAnswers.urbana === 'si'}
                                                            onChange={() => selectZona('urbana', 'si')}
                                                        />
                                                        <span>Sí</span>
                                                    </label>
                                                    <label className="radio-pill">
                                                        <input
                                                            type="radio"
                                                            name="zona-urb"
                                                            checked={resAnswers.urbana === 'no'}
                                                            onChange={() => selectZona('urbana', 'no')}
                                                        />
                                                        <span>No</span>
                                                    </label>
                                                </div>
                                            </article>

                                            {/* Zona rural */}
                                            <article className="member-card" style={{ width: '50%', minHeight: 220 }}>
                                                <div className="member-left">
                                                    <img className="member-avatar" src={ICON_RUR} alt="Zona rural" style={{ width: 110, height: 110 }} />
                                                    <div className="member-texts">
                                                        <h3 className="member-title" style={{ fontSize: 22 }}>Zona rural</h3>
                                                        <small className="form-hint">Veredas, fincas, caseríos</small>
                                                    </div>
                                                </div>
                                                <div className="member-actions">
                                                    <label className="radio-pill">
                                                        <input
                                                            type="radio"
                                                            name="zona-rur"
                                                            checked={resAnswers.rural === 'si'}
                                                            onChange={() => selectZona('rural', 'si')}
                                                        />
                                                        <span>Sí</span>
                                                    </label>
                                                    <label className="radio-pill">
                                                        <input
                                                            type="radio"
                                                            name="zona-rur"
                                                            checked={resAnswers.rural === 'no'}
                                                            onChange={() => selectZona('rural', 'no')}
                                                        />
                                                        <span>No</span>
                                                    </label>
                                                </div>
                                            </article>
                                        </div>
                                    </div>
                                );
                            }

                            // Vista 2: una vez marcada una zona con "Sí"
                            const icon  = sel === 'urbana' ? ICON_URB : ICON_RUR;
                            const title = sel === 'urbana' ? 'Zona urbana' : 'Zona rural';
                            const hint  = sel === 'urbana' ? 'Barrios, conjuntos, apartamentos' : 'Veredas, fincas, caseríos';
                            const zonaAnswer = resAnswers[sel];

                            return (
                                <div className="modal-content">
                                    {/* Izquierda: icono grande */}
                                    <div className="modal-left">
                                        <img src={icon} alt={title} className="modal-avatar" style={{ width: 220, height: 220 }} />
                                    </div>

                                    {/* Derecha: encabezado + radios + formulario */}
                                    <div className="modal-right">
                                        <div className="member-left" style={{ marginBottom: 8 }}>
                                            <div className="member-texts">
                                                <h3 className="member-title" style={{ fontSize: 22 }}>{title}</h3>
                                                <small className="form-hint">{hint}</small>
                                            </div>
                                            <div className="member-actions" style={{ marginLeft: 'auto' }}>
                                                <label className="radio-pill">
                                                    <input
                                                        type="radio"
                                                        checked={zonaAnswer === 'si'}
                                                        onChange={() => selectZona(sel, 'si')}
                                                    />
                                                    <span>Sí</span>
                                                </label>
                                                <label className="radio-pill">
                                                    <input
                                                        type="radio"
                                                        checked={zonaAnswer === 'no'}
                                                        onChange={() => selectZona(sel, 'no')} // volverá a mostrar las dos tarjetas
                                                    />
                                                    <span>No</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Formulario de residencia */}
                                        <div className="modal-body modal-body--scroll" style={{ paddingTop: 6 }}>
                                            <div className="grid-2">
                                                <label className="field">
                                                    <span className="field-label">Ciudad / Vereda</span>
                                                    <input
                                                        className="input"
                                                        value={resForm.ciudadVereda ?? ''}
                                                        onChange={(e) => setResForm(f => ({ ...f, ciudadVereda: e.target.value }))}
                                                    />
                                                </label>

                                                <label className="field">
                                                    <span className="field-label">Dirección</span>
                                                    <input
                                                        className="input"
                                                        value={resForm.direccion ?? ''}
                                                        onChange={(e) => setResForm(f => ({ ...f, direccion: e.target.value }))}
                                                    />
                                                </label>

                                                <label className="field" style={{ gridColumn: '1 / -1' }}>
                                                    <span className="field-label">Tipo de vivienda</span>
                                                    <input
                                                        className="input"
                                                        placeholder="Ej. Casa, Apartamento, Finca..."
                                                        value={resForm.tipoVivienda ?? ''}
                                                        onChange={(e) => setResForm(f => ({ ...f, tipoVivienda: e.target.value }))}
                                                    />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="modal-actions">
                                            <button className="btn-primary" onClick={saveResidencia}>Guardar</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

                    {/* Fondo con animación */}
                    <button
                        className="modal-backdrop"
                        aria-label="Backdrop"
                        style={{ opacity: resAnimIn ? 1 : 0, transition: 'opacity 260ms' }}
                        onClick={(e) => e.preventDefault()} // se guarda desde el botón
                    />
                </div>
            )}


            {/* ====== MODAL GENERAL ====== */}
            {modalFor && currentMember && (
                <div className="modal-overlay" role="dialog" aria-modal="true">
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-head">
                            <h4>Información de {currentMember.label}</h4>
                            <button className="modal-close" onClick={cancelModal} aria-label="Cerrar">×</button>
                        </div>

                        <div className="modal-content">
                            <div className="modal-left">
                                <img src={currentMember.img} alt={currentMember.label} className="modal-avatar" />
                            </div>

                            <div className="modal-right">
                                {EXTENDED_KEYS.includes(modalFor) ? (
                                    <>
                                        <div className="modal-body modal-body--scroll">
                                            <div className="grid-2">
                                                <label className="field"><span className="field-label">Nombre y apellido</span>
                                                    <input className="input" value={tmpPerson.nombreCompleto}
                                                           onChange={e => setTmpPerson({...tmpPerson, nombreCompleto: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Edad</span>
                                                    <input className="input" type="number" min="0" value={tmpPerson.edad}
                                                           onChange={e => setTmpPerson({...tmpPerson, edad: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Teléfono</span>
                                                    <input className="input" value={tmpPerson.telefono}
                                                           onChange={e => setTmpPerson({...tmpPerson, telefono: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label"># Cédula</span>
                                                    <input className="input" value={tmpPerson.cedula}
                                                           onChange={e => setTmpPerson({...tmpPerson, cedula: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Profesión</span>
                                                    <input className="input" value={tmpPerson.profesion}
                                                           onChange={e => setTmpPerson({...tmpPerson, profesion: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Me dedico a</span>
                                                    <input className="input" value={tmpPerson.meDedicoA}
                                                           onChange={e => setTmpPerson({...tmpPerson, meDedicoA: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Tiempo de trabajo</span>
                                                    <input className="input" placeholder="Ej. 8 h/día" value={tmpPerson.tiempoTrabajo}
                                                           onChange={e => setTmpPerson({...tmpPerson, tiempoTrabajo: e.target.value})}/>
                                                </label>
                                                <div></div>
                                                <label className="field"><span className="field-label">Ingresos mensuales</span>
                                                    <input className="input" type="number" min="0" value={tmpPerson.ingresosMensuales}
                                                           onChange={e => setTmpPerson({...tmpPerson, ingresosMensuales: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Egresos mensuales</span>
                                                    <input className="input" type="number" min="0" value={tmpPerson.egresosMensuales}
                                                           onChange={e => setTmpPerson({...tmpPerson, egresosMensuales: e.target.value})}/>
                                                </label>
                                            </div>

                                            <fieldset className="fieldset">
                                                <legend>Distribución mensual</legend>
                                                <div className="grid-2">
                                                    {(['vivienda','alimentacion','estudio','salud','recreacion','otros'] as const).map((k) => (
                                                        <label key={k} className="field">
                                                            <span className="field-label">{k[0].toUpperCase()+k.slice(1)}</span>
                                                            <input className="input" type="number" min="0"
                                                                   value={(tmpPerson.distribucion as any)[k]}
                                                                   onChange={e => setTmpPerson({ ...tmpPerson, distribucion: { ...tmpPerson.distribucion, [k]: e.target.value } as any })}/>
                                                        </label>
                                                    ))}
                                                </div>
                                            </fieldset>

                                            <fieldset className="fieldset">
                                                <legend>Estado civil</legend>
                                                <div className="radio-row">
                                                    {(['soltero','casado','union_libre','divorciado'] as EstadoCivil[]).map(op => (
                                                        <label key={op} className="radio-pill">
                                                            <input type="radio" name={`ec-${modalFor}`} checked={tmpPerson.estadoCivil === op}
                                                                   onChange={() => setTmpPerson({...tmpPerson, estadoCivil: op})}/>
                                                            <span>{op === 'union_libre' ? 'Unión libre' : op.charAt(0).toUpperCase()+op.slice(1)}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </fieldset>

                                            <fieldset className="fieldset">
                                                <legend>Presencia</legend>
                                                <div className="radio-row">
                                                    {(['presente','ausente'] as Presencia[]).map(op => (
                                                        <label key={op} className="radio-pill">
                                                            <input type="radio" name={`pr-${modalFor}`} checked={tmpPerson.presencia === op}
                                                                   onChange={() => setTmpPerson({...tmpPerson, presencia: op})}/>
                                                            <span>{op[0].toUpperCase()+op.slice(1)}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </fieldset>

                                            <div className="grid-2">
                                                <label className="field"><span className="field-label">Promedio de tiempo que dedica a la familia</span>
                                                    <input className="input" placeholder="Ej. 2 h/día" value={tmpPerson.promedioTiempoFamilia}
                                                           onChange={e => setTmpPerson({...tmpPerson, promedioTiempoFamilia: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Nivel de escolaridad</span>
                                                    <input className="input" value={tmpPerson.nivelEscolaridad}
                                                           onChange={e => setTmpPerson({...tmpPerson, nivelEscolaridad: e.target.value})}/>
                                                </label>
                                            </div>

                                            <fieldset className="fieldset">
                                                <legend>¿Tiene alguna discapacidad?</legend>
                                                <div className="radio-row">
                                                    {(['si','no'] as const).map(op => (
                                                        <label key={op} className="radio-pill">
                                                            <input type="radio" name={`disc-${modalFor}`} checked={tmpPerson.tieneDiscapacidad === op}
                                                                   onChange={() => setTmpPerson({...tmpPerson, tieneDiscapacidad: op})}/>
                                                            <span>{op.toUpperCase()}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {tmpPerson.tieneDiscapacidad === 'si' && (
                                                    <label className="field" style={{marginTop:8}}>
                                                        <span className="field-label">Detalle</span>
                                                        <input className="input" value={tmpPerson.detalleDiscapacidad}
                                                               onChange={e => setTmpPerson({...tmpPerson, detalleDiscapacidad: e.target.value})}/>
                                                    </label>
                                                )}
                                            </fieldset>

                                            <div className="grid-2">
                                                <label className="field"><span className="field-label">Dirección residencial</span>
                                                    <input className="input" value={tmpPerson.direccion}
                                                           onChange={e => setTmpPerson({...tmpPerson, direccion: e.target.value})}/>
                                                </label>
                                                <label className="field"><span className="field-label">Ciudad</span>
                                                    <input className="input" value={tmpPerson.ciudad}
                                                           onChange={e => setTmpPerson({...tmpPerson, ciudad: e.target.value})}/>
                                                </label>
                                            </div>

                                            <label className="field"><span className="field-label">Objetivos específicos en familia</span>
                                                <textarea className="input" rows={3} value={tmpPerson.objetivosFamilia}
                                                          onChange={e => setTmpPerson({...tmpPerson, objetivosFamilia: e.target.value})}/>
                                            </label>
                                        </div>

                                        <div className="modal-actions">
                                            <button className="btn-primary" onClick={saveModal}>Guardar</button>
                                            <button className="btn-ghost" onClick={cancelModal}>Cancelar</button>
                                        </div>
                                    </>
                                ) : modalFor === 'hijos' ? (
                                    <>
                                        <div className="modal-body modal-body--scroll">
                                            <label className="field"><span className="field-label">¿Cuántos hijos?</span>
                                                <input className="input" type="number" min={1} max={10} placeholder="Ej. 2"
                                                       value={tmpHijos.cantidad} onChange={(e) => setCantidadHijos(e.target.value)} />
                                            </label>

                                            {Number(tmpHijos.cantidad || 0) > 0 && tmpHijos.hijos.map((h, i) => (
                                                <fieldset key={i} className="fieldset">
                                                    <legend>Hijo {i + 1}</legend>

                                                    <div className="grid-2">
                                                        <label className="field"><span className="field-label">Nombre y apellido</span>
                                                            <input className="input" value={h.nombreCompleto}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, nombreCompleto: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">Documento</span>
                                                            <input className="input" value={h.documento}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, documento: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">Edad</span>
                                                            <input className="input" type="number" min="0" value={h.edad}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, edad: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">Teléfono</span>
                                                            <input className="input" value={h.telefono}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, telefono: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">Ciudad</span>
                                                            <input className="input" value={h.ciudad}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, ciudad: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">Residencia</span>
                                                            <input className="input" value={h.residencia}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, residencia: e.target.value} : x) }))}/>
                                                        </label>
                                                    </div>

                                                    <fieldset className="fieldset" style={{marginTop:8}}>
                                                        <legend>Vive con</legend>
                                                        <div className="radio-row">
                                                            {(['papa','mama','ambos'] as ViveCon[]).map(op => (
                                                                <label key={op} className="radio-pill">
                                                                    <input type="radio" name={`vivecon-${i}`} checked={h.viveCon === op}
                                                                           onChange={() => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, viveCon: op} : x) }))}/>
                                                                    <span>{op === 'ambos' ? 'Papá y mamá' : (op === 'papa' ? 'Papá' : 'Mamá')}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </fieldset>

                                                    <fieldset className="fieldset">
                                                        <legend>¿Tienes hermanos?</legend>
                                                        <div className="radio-row">
                                                            {(['si','no'] as const).map(op => (
                                                                <label key={op} className="radio-pill">
                                                                    <input type="radio" name={`hermanos-${i}`} checked={h.tieneHermanos === op}
                                                                           onChange={() => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, tieneHermanos: op} : x) }))}/>
                                                                    <span>{op.toUpperCase()}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {h.tieneHermanos === 'si' && (
                                                            <label className="field" style={{marginTop:8}}>
                                                                <span className="field-label"># de hermanos</span>
                                                                <input className="input" type="number" min="0" value={h.numeroHermanos}
                                                                       onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, numeroHermanos: e.target.value} : x) }))}/>
                                                            </label>
                                                        )}
                                                    </fieldset>

                                                    <div className="grid-2">
                                                        <label className="field"><span className="field-label">Grado de escolaridad</span>
                                                            <input className="input" value={h.gradoEscolaridad}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, gradoEscolaridad: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">Colegio</span>
                                                            <input className="input" value={h.colegio}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, colegio: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">Del 1 al 10 ¿cómo te va en el colegio?</span>
                                                            <input className="input" type="number" min="1" max="10" value={h.calificacionColegio}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, calificacionColegio: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">¿Qué disfrutas hacer en tiempo libre?</span>
                                                            <input className="input" value={h.tiempoLibre}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, tiempoLibre: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">¿Quién te ayuda en las tareas?</span>
                                                            <input className="input" value={h.ayudaTareas}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, ayudaTareas: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">¿Qué carrera te gustaría estudiar? ¿Por qué?</span>
                                                            <input className="input" value={h.carreraGustaria}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, carreraGustaria: e.target.value} : x) }))}/>
                                                        </label>
                                                        <label className="field"><span className="field-label">¿Qué tiempo pasas en familia?</span>
                                                            <input className="input" value={h.tiempoEnFamilia}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, tiempoEnFamilia: e.target.value} : x) }))}/>
                                                        </label>
                                                    </div>

                                                    <fieldset className="fieldset">
                                                        <legend>¿Tienes amigos cercanos?</legend>
                                                        <div className="radio-row">
                                                            {(['si','no'] as const).map(op => (
                                                                <label key={op} className="radio-pill">
                                                                    <input type="radio" name={`amigos-${i}`} checked={h.amigosCercanos === op}
                                                                           onChange={() => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, amigosCercanos: op} : x) }))}/>
                                                                    <span>{op.toUpperCase()}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {h.amigosCercanos === 'si' && (
                                                            <label className="field" style={{marginTop:8}}>
                                                                <span className="field-label">¿Cuántos?</span>
                                                                <input className="input" type="number" min="0" value={h.cuantosAmigos}
                                                                       onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, cuantosAmigos: e.target.value} : x) }))}/>
                                                            </label>
                                                        )}
                                                    </fieldset>

                                                    <div className="grid-2">
                                                        <label className="field"><span className="field-label">Tiempo al computador/cel/redes</span>
                                                            <input className="input" value={h.tiempoPantalla}
                                                                   onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, tiempoPantalla: e.target.value} : x) }))}/>
                                                        </label>
                                                        <div></div>
                                                    </div>

                                                    <fieldset className="fieldset">
                                                        <legend>¿Chequeos médicos con regularidad?</legend>
                                                        <div className="radio-row">
                                                            {(['si','no'] as const).map(op => (
                                                                <label key={op} className="radio-pill">
                                                                    <input type="radio" name={`chequeos-${i}`} checked={h.chequeosMedicos === op}
                                                                           onChange={() => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, chequeosMedicos: op} : x) }))}/>
                                                                    <span>{op.toUpperCase()}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </fieldset>

                                                    <fieldset className="fieldset">
                                                        <legend>¿Discapacidad específica?</legend>
                                                        <div className="radio-row">
                                                            {(['si','no'] as const).map(op => (
                                                                <label key={op} className="radio-pill">
                                                                    <input type="radio" name={`disc-${i}`} checked={h.discapacidad === op}
                                                                           onChange={() => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, discapacidad: op} : x) }))}/>
                                                                    <span>{op.toUpperCase()}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {h.discapacidad === 'si' && (
                                                            <label className="field" style={{marginTop:8}}>
                                                                <span className="field-label">Detalle</span>
                                                                <input className="input" value={h.detalleDiscapacidad}
                                                                       onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, detalleDiscapacidad: e.target.value} : x) }))}/>
                                                            </label>
                                                        )}
                                                    </fieldset>

                                                    <label className="field"><span className="field-label">¿Cómo te sientes ahora con tu familia?</span>
                                                        <textarea className="input" rows={2} value={h.comoSeSienteFamilia}
                                                                  onChange={e => setTmpHijos(s => ({ ...s, hijos: s.hijos.map((x, idx) => idx===i ? {...x, comoSeSienteFamilia: e.target.value} : x) }))}/>
                                                    </label>
                                                </fieldset>
                                            ))}
                                        </div>

                                        <div className="modal-actions">
                                            <button className="btn-primary" onClick={saveModal}>Guardar</button>
                                            <button className="btn-ghost" onClick={cancelModal}>Cancelar</button>
                                        </div>
                                    </>
                                ) : modalFor === 'mascotas' ? (
                                    <>
                                        <div className="modal-body modal-body--scroll">
                                            <label className="field"><span className="field-label">¿Cuántas mascotas?</span>
                                                <input className="input" type="number" min={1} max={12} placeholder="Ej. 2"
                                                       value={tmpMascotas.cantidad} onChange={(e) => setCantidadMascotas(e.target.value)} />
                                            </label>

                                            {Number(tmpMascotas.cantidad || 0) > 0 && tmpMascotas.mascotas.map((m, i) => (
                                                <fieldset key={i} className="fieldset">
                                                    <legend>Mascota {i + 1}</legend>
                                                    <div className="grid-2">
                                                        <label className="field"><span className="field-label">Nombre de la mascota</span>
                                                            <input className="input" value={m.nombre}
                                                                   onChange={e => setTmpMascotas(s => ({ ...s, mascotas: s.mascotas.map((x, idx) => idx===i ? {...x, nombre: e.target.value} : x) }))}/>
                                                        </label>
                                                        <div className="field">
                                                            <span className="field-label">Tipo de mascota</span>
                                                            <div className="radio-row">
                                                                {PET_TYPES.map(t => (
                                                                    <label key={t} className="radio-pill">
                                                                        <input type="radio" name={`pet-type-${i}`} checked={m.tipo === t}
                                                                               onChange={() => setTmpMascotas(s => ({ ...s, mascotas: s.mascotas.map((x, idx) => idx===i ? {...x, tipo: t, tipoOtro: ''} : x) }))}/>
                                                                        <span>{t}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                            {m.tipo === 'Otro' && (
                                                                <label className="field" style={{marginTop:8}}>
                                                                    <span className="field-label">¿Cuál?</span>
                                                                    <input className="input" value={m.tipoOtro}
                                                                           onChange={e => setTmpMascotas(s => ({ ...s, mascotas: s.mascotas.map((x, idx) => idx===i ? {...x, tipoOtro: e.target.value} : x) }))}/>
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            ))}
                                        </div>

                                        <div className="modal-actions">
                                            <button className="btn-primary" onClick={saveModal}>Guardar</button>
                                            <button className="btn-ghost" onClick={cancelModal}>Cancelar</button>
                                        </div>
                                    </>
                                ) : modalFor === 'otro' ? (
                                    <>
                                        <div className="modal-body modal-body--scroll">
                                            <div className="grid-2">
                                                <fieldset className="fieldset">
                                                    <legend>Sexo</legend>
                                                    <div className="radio-row">
                                                        {(['Masculino','Femenino','Otro'] as Genero[]).map(g => (
                                                            <label key={g} className="radio-pill">
                                                                <input type="radio" name="otro-sexo" checked={tmpOtro.sexo === g}
                                                                       onChange={() => setTmpOtro(o => ({ ...o, sexo: g }))}/>
                                                                <span>{g}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </fieldset>

                                                <label className="field">
                                                    <span className="field-label">Parentesco</span>
                                                    <input className="input" placeholder="Ej. Vecino, Tutor legal, Primo..."
                                                           value={tmpOtro.parentesco}
                                                           onChange={e => setTmpOtro(o => ({ ...o, parentesco: e.target.value }))}/>
                                                </label>

                                                <label className="field">
                                                    <span className="field-label">Nombre</span>
                                                    <input className="input" value={tmpOtro.nombre}
                                                           onChange={e => setTmpOtro(o => ({ ...o, nombre: e.target.value }))}/>
                                                </label>

                                                <label className="field">
                                                    <span className="field-label">Edad</span>
                                                    <input className="input" type="number" min="0" value={tmpOtro.edad}
                                                           onChange={e => setTmpOtro(o => ({ ...o, edad: e.target.value }))}/>
                                                </label>
                                            </div>

                                            <fieldset className="fieldset">
                                                <legend>¿Hijos?</legend>
                                                <div className="radio-row">
                                                    {(['si','no'] as const).map(v => (
                                                        <label key={v} className="radio-pill">
                                                            <input type="radio" name="otro-hijos" checked={tmpOtro.tieneHijos === v}
                                                                   onChange={() => setTmpOtro(o => ({ ...o, tieneHijos: v }))}/>
                                                            <span>{v.toUpperCase()}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                                {tmpOtro.tieneHijos === 'si' && (
                                                    <label className="field" style={{marginTop:8}}>
                                                        <span className="field-label">¿Cuántos?</span>
                                                        <input className="input" type="number" min="0" value={tmpOtro.cuantosHijos}
                                                               onChange={e => setTmpOtro(o => ({ ...o, cuantosHijos: e.target.value }))}/>
                                                    </label>
                                                )}
                                            </fieldset>

                                            <label className="field">
                                                <span className="field-label">Tiempo en casa</span>
                                                <input className="input" placeholder="Ej. 1 día a la semana / 3 h diarias"
                                                       value={tmpOtro.tiempoEnCasa}
                                                       onChange={e => setTmpOtro(o => ({ ...o, tiempoEnCasa: e.target.value }))}/>
                                            </label>

                                            <label className="field">
                                                <span className="field-label">¿Trabaja o estudia?</span>
                                                <input className="input" placeholder="Ej. Trabaja (turno tarde) / Estudia (nocturno)"
                                                       value={tmpOtro.trabajaOEstudia}
                                                       onChange={e => setTmpOtro(o => ({ ...o, trabajaOEstudia: e.target.value }))}/>
                                            </label>
                                        </div>

                                        <div className="modal-actions">
                                            <button className="btn-primary" onClick={saveModal}>Guardar</button>
                                            <button className="btn-ghost" onClick={cancelModal}>Cancelar</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="modal-body">
                                            <label className="field"><span className="field-label">Detalle</span>
                                                <input className="input" placeholder={modalPlaceholder(modalFor!)} value={tmpNombre}
                                                       onChange={(e) => setTmpNombre(e.target.value)} />
                                            </label>
                                        </div>
                                        <div className="modal-actions">
                                            <button className="btn-primary" onClick={saveModal}>Guardar</button>
                                            <button className="btn-ghost" onClick={cancelModal}>Cancelar</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <button className="modal-backdrop" aria-label="Cerrar" onClick={cancelModal} />
                </div>
            )}

            <section className="preview">
                <h4>Preview del payload a guardar</h4>
                <pre>{JSON.stringify(payload, null, 2)}</pre>
            </section>
        </main>
    );
}
