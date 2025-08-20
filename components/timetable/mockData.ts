import type { TimetableEvent, DayWorkingHours, Classe, Teacher, Student, SubjectCoefficient } from '../../types';
import { mockSubjectCoefficients } from '../scholarship/mockSubjectData';

// --- CENTRALIZED DATA GENERATION ---

// --- HELPERS & SHARED DATA ---
const getSpecialiteAbbr = (specialite: string): string => {
  const abbreviations: { [key: string]: string } = {
    'Tronc commun': 'AS', 'Tronc Commun': 'AS', 'Sport': 'SPORT', 'Sciences': 'SC', 'Économie et Services': 'ECO-SERV',
    'Economie et Gestion': 'ECO-GES', 'Lettres': 'LETT', 'Sciences Expérimentales': 'SC.EXP', 'Mathématiques': 'MATH',
    'Techniques': 'TECH', 'Technologie': 'TECH', 'Sciences Informatiques': 'INFO', "Sciences de l'Informatique": 'INFO',
    "Technologie de l'Informatique": 'INFO-TECH'
  };
  return abbreviations[specialite] || specialite.substring(0, 4).toUpperCase();
};

const specializationsByLevel: { [key: string]: string[] } = {
  '1 annee': ['Tronc Commun'],
  '2 annee': ['Lettres', 'Économie et Services', 'Technologie de l\'Informatique', 'Sciences'],
  '3 annee': ['Lettres', 'Économie et Gestion', 'Sciences de l\'Informatique', 'Sciences Techniques', 'Sciences Expérimentales', 'Mathématiques', 'Sport'],
  '4 annee': ['Lettres', 'Économie et Gestion', 'Sciences de l\'Informatique', 'Sciences Techniques', 'Sciences Expérimentales', 'Mathématiques', 'Sport'],
};
const levels = ['1 annee', '2 annee', '3 annee', '4 annee'];

// --- WORKING HOURS GENERATION ---
export const initialWorkingHours: DayWorkingHours[] = [
    { day: 'Lundi', dayIndex: 1, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Mardi', dayIndex: 2, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Mercredi', dayIndex: 3, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Jeudi', dayIndex: 4, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
    { day: 'Vendredi', dayIndex: 5, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '17:00' },
    { day: 'Samedi', dayIndex: 6, isWorkingDay: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '16:00' },
];

// --- CLASSES GENERATION ---
const generateClasses = (): Classe[] => {
    const classes: Classe[] = [];
    let classIdCounter = 1;
    levels.forEach(niveau => {
        const specialites = specializationsByLevel[niveau];
        specialites.forEach(specialite => {
            for (let i = 1; i <= 3; i++) {
                const niveauPrefix = niveau.split(' ')[0];
                const specialiteAbbr = getSpecialiteAbbr(specialite);
                const className = `${niveauPrefix} ${specialiteAbbr} ${i}`;
                classes.push({
                    id: `c${classIdCounter++}`,
                    niveau: niveau,
                    specialite: specialite,
                    number: i,
                    name: className,
                });
            }
        });
    });
    return classes.sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
};
export const initialClasses: Classe[] = generateClasses();

// --- TEACHERS GENERATION (WITH WORKLOAD BALANCING) ---
const teacherFirstNamesMale = ['Karim', 'Ali', 'Mohamed', 'Ahmed', 'Youssef', 'Omar', 'Sami', 'Walid', 'Khaled', 'Anis', 'Hedi', 'Nizar', 'Foued', 'Imed', 'Mounir'];
const teacherFirstNamesFemale = ['Salma', 'Mariem', 'Nour', 'Yasmine', 'Ines', 'Sarah', 'Leila', 'Rim', 'Hedia', 'Sonia', 'Faten', 'Amel', 'Nadia', 'Olfa', 'Lamia'];
const teacherLastNames = ['Ben Ali', 'Mansouri', 'Zouari', 'Trabelsi', 'Guesmi', 'Jlassi', 'Dridi', 'Amri', 'Chebbi', 'Saidi', 'Khemiri', 'Mejri', 'Chaabane', 'Guizani', 'Bouaziz'];
const places = ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabès', 'Nabeul', 'Monastir'];
const diplomas = ['Doctorat', 'Masters', 'Bachelors'];
const statuses = ['Permanent', 'Vacataire', 'Contractuel'];

const generateTeachers = (): Teacher[] => {
    const subjectHours: { [subject: string]: number } = {};
    initialClasses.forEach(c => {
        mockSubjectCoefficients
            .filter(sc => sc.level === c.niveau && sc.specialization === c.specialite)
            .forEach(sc => {
                const totalHours = parseFloat(sc.hours);
                if (!isNaN(totalHours)) {
                    subjectHours[sc.subject] = (subjectHours[sc.subject] || 0) + totalHours;
                }
            });
    });

    const teachers: Teacher[] = [];
    let teacherIdCounter = 1;
    const TARGET_HOURS_PER_TEACHER = 10; // Lowered to generate more teachers

    Object.keys(subjectHours).forEach(subject => {
        const totalHours = subjectHours[subject];
        const numTeachersNeeded = Math.max(1, Math.ceil(totalHours / TARGET_HOURS_PER_TEACHER));

        for (let i = 0; i < numTeachersNeeded; i++) {
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const firstName = gender === 'Male' 
                ? teacherFirstNamesMale[Math.floor(Math.random() * teacherFirstNamesMale.length)]
                : teacherFirstNamesFemale[Math.floor(Math.random() * teacherFirstNamesFemale.length)];
            const lastName = teacherLastNames[Math.floor(Math.random() * teacherLastNames.length)];
            const id = `T${String(teacherIdCounter).padStart(3, '0')}`;
            
            teachers.push({
                id: id,
                avatar: `https://i.pravatar.cc/150?u=${id}`,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}${i}@northwood.edu`,
                phone: `555-0${String(teacherIdCounter).padStart(3, '0')}`,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                dateOfBirth: `${1964 + Math.floor(Math.random() * 30)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                placeOfBirth: places[Math.floor(Math.random() * places.length)],
                nationality: 'Tunisian',
                address: `${Math.floor(Math.random() * 100) + 1} Rue de la Liberté, ${places[Math.floor(Math.random() * places.length)]}`,
                diploma: diplomas[Math.floor(Math.random() * diplomas.length)],
                specialty: subject,
                professionalStatus: statuses[Math.floor(Math.random() * statuses.length)],
                yearsOfExperience: String(Math.floor(Math.random() * 25) + 3),
                matricule: `T2024${String(teacherIdCounter).padStart(3, '0')}`,
                bank: 'Bank of Academia',
                rib: Array(20).fill(0).map(() => Math.floor(Math.random() * 10)).join(''),
                idType: 'CIN',
                idNumber: Array(8).fill(0).map(() => Math.floor(Math.random() * 10)).join(''),
            });
            teacherIdCounter++;
        }
    });
    return teachers;
};
export const mockTeachers: Teacher[] = generateTeachers();

// --- STUDENT GENERATION ---
const studentFirstNamesMale = ['Karim', 'Ali', 'Mohamed', 'Ahmed', 'Youssef', 'Omar', 'Sami', 'Walid', 'Khaled', 'Anis', 'Hedi', 'Nizar', 'Fares', 'Rami', 'Zied'];
const studentFirstNamesFemale = ['Amira', 'Fatma', 'Salma', 'Mariem', 'Nour', 'Yasmine', 'Ines', 'Sarah', 'Leila', 'Rim', 'Hedia', 'Sonia', 'Faten', 'Amel', 'Cyrine'];
const studentLastNames = ['Ben Ali', 'Mansouri', 'Zouari', 'Trabelsi', 'Guesmi', 'Jlassi', 'Dridi', 'Amri', 'Chebbi', 'Saidi', 'Khemiri', 'Mejri', 'Hamdi', 'Toumi', 'Abbasi'];
const optionalSubjectsList = ['Musique', 'espagnole', 'allemand', 'Dessin'];

const getBirthYearForLevel = (level: string): number => {
    const currentYear = new Date().getFullYear();
    switch (level) {
        case '1 annee': return currentYear - 15;
        case '2 annee': return currentYear - 16;
        case '3 annee': return currentYear - 17;
        case '4 annee': return currentYear - 18;
        default: return currentYear - 16;
    }
};

const generateStudents = (classes: Classe[]): Student[] => {
    const students: Student[] = [];
    let studentIdCounter = 1;

    classes.forEach(c => {
        for (let i = 0; i < 20; i++) {
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const firstName = gender === 'Male'
                ? studentFirstNamesMale[Math.floor(Math.random() * studentFirstNamesMale.length)]
                : studentFirstNamesFemale[Math.floor(Math.random() * studentFirstNamesFemale.length)];
            const lastName = studentLastNames[Math.floor(Math.random() * studentLastNames.length)];
            const id = `S${String(studentIdCounter).padStart(4, '0')}`;
            const birthYear = getBirthYearForLevel(c.niveau) + (Math.random() > 0.5 ? 0 : -1);
            
            students.push({
                id: id,
                matricule: `S2024${String(studentIdCounter).padStart(4, '0')}`,
                avatar: `https://i.pravatar.cc/150?u=${id}`,
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                dateOfBirth: `${birthYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
                placeOfBirth: places[Math.floor(Math.random() * places.length)],
                address: `${Math.floor(Math.random() * 100) + 1} Avenue Habib Bourguiba, ${places[Math.floor(Math.random() * places.length)]}`,
                academicLevel: c.niveau,
                academicSpecialty: c.specialite,
                option: (c.niveau === '3 annee' || c.niveau === '4 annee') && Math.random() > 0.6 
                    ? optionalSubjectsList[Math.floor(Math.random() * optionalSubjectsList.length)]
                    : '',
                parentPhone: `216-${String(Math.floor(Math.random() * 80) + 20)}-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 900) + 100).slice(0,3)}`,
                parentEmail: `${lastName.toLowerCase().replace(' ','')}.${firstName.charAt(0).toLowerCase()}.parent@email.com`,
                classe: c.name,
                schoolYear: '2025/2026',
                idNumber: `1${Array(7).fill(0).map(() => Math.floor(Math.random() * 10)).join('')}`,
                academicDiploma: c.niveau === '4 annee' ? 'Baccalauréat' : 'N/A',
            });
            studentIdCounter++;
        }
    });
    return students;
};
export const mockStudents: Student[] = generateStudents(initialClasses);

// --- HALLS GENERATION ---
const generateHalls = (): string[] => {
    const halls: string[] = [];
    for (let i = 1; i <= 60; i++) halls.push(`Salle ${i}`);
    for (let i = 1; i <= 16; i++) halls.push(`Labo PH ${i}`);
    for (let i = 1; i <= 16; i++) halls.push(`Labo SVT ${i}`);
    for (let i = 1; i <= 16; i++) halls.push(`Salle Informatique ${i}`);
    for (let i = 1; i <= 16; i++) halls.push(`Salle Technologie ${i}`);
    for (let i = 1; i <= 16; i++) halls.push(`Terrain du Sport ${i}`);
    return halls.sort((a,b) => a.localeCompare(b, undefined, { numeric: true }));
};
export const initialHalls = generateHalls();

// --- TIMETABLE GENERATION ALGORITHM ---

const subjectColors = [
  'bg-red-200 border-red-300 text-red-800', 'bg-orange-200 border-orange-300 text-orange-800',
  'bg-amber-200 border-amber-300 text-amber-800', 'bg-yellow-200 border-yellow-300 text-yellow-800',
  'bg-lime-200 border-lime-300 text-lime-800', 'bg-green-200 border-green-300 text-green-800',
  'bg-emerald-200 border-emerald-300 text-emerald-800', 'bg-teal-200 border-teal-300 text-teal-800',
  'bg-cyan-200 border-cyan-300 text-cyan-800', 'bg-sky-200 border-sky-300 text-sky-800',
  'bg-blue-200 border-blue-300 text-blue-800', 'bg-indigo-200 border-indigo-300 text-indigo-800',
  'bg-violet-200 border-violet-300 text-violet-800', 'bg-purple-200 border-purple-300 text-purple-800',
  'bg-fuchsia-200 border-fuchsia-300 text-fuchsia-800', 'bg-pink-200 border-pink-300 text-pink-800',
  'bg-rose-200 border-rose-300 text-rose-800'
];
let colorIndex = 0;
const subjectColorMap: { [key: string]: string } = {};
const getSubjectColor = (subject: string) => {
    if (!subjectColorMap[subject]) {
        subjectColorMap[subject] = subjectColors[colorIndex % subjectColors.length];
        colorIndex++;
    }
    return subjectColorMap[subject];
};

const categorizeHalls = (halls: string[]) => {
    const categorized: {[key:string]: string[]} = {
        'Physique': halls.filter(h => h.startsWith('Labo PH')),
        'Sciences de la Vie et de la Terre': halls.filter(h => h.startsWith('Labo SVT')),
        'Informatique': halls.filter(h => h.startsWith('Salle Informatique')),
        'Technologie': halls.filter(h => h.startsWith('Salle Technologie')),
        'Génie Électrique': halls.filter(h => h.startsWith('Salle Technologie')),
        'Génie Mécanique': halls.filter(h => h.startsWith('Salle Technologie')),
        'Sport': halls.filter(h => h.startsWith('Terrain du Sport')),
        'general': halls.filter(h => h.startsWith('Salle ')),
    };
    categorized['Algorithmique & Programmation'] = categorized['Informatique'];
    categorized['Systèmes & Réseaux'] = categorized['Informatique'];
    categorized['Bases de données'] = categorized['Informatique'];
    categorized['Tech-Inf-comm (TIC)'] = categorized['Informatique'];
    return categorized;
};

const timeToMinutes = (time: string): number => {
    if (!time) return 0;
    const [hour, minute] = time.split(':').map(Number);
    return hour * 60 + minute;
};

const minutesToTimeStr = (minutes: number): string => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
};

const generateFullTimetable = (): TimetableEvent[] => {
    const events: TimetableEvent[] = [];
    let eventId = 1;

    // --- NEW: Assign a specific tech specialty to each "Sciences Techniques" class ---
    const techSpecialtyMap = new Map<string, 'Génie Électrique' | 'Génie Mécanique'>();
    initialClasses.forEach(c => {
        if (c.specialite === 'Sciences Techniques') {
            techSpecialtyMap.set(c.name, Math.random() < 0.5 ? 'Génie Électrique' : 'Génie Mécanique');
        }
    });

    // --- 1. Teacher Assignment Phase ---
    const teacherAssignments = new Map<string, string>(); // Key: "className-subject", Value: teacherFullName
    const teacherWorkload = new Map<string, number>(); // Key: teacherFullName, Value: hours
    mockTeachers.forEach(t => teacherWorkload.set(`${t.firstName} ${t.lastName}`, 0));

    for (const c of initialClasses) {
        let subjectsForClass = mockSubjectCoefficients.filter(s => s.level === c.niveau && s.specialization === c.specialite);
        
        // Filter tech subjects based on pre-assignment
        if (c.specialite === 'Sciences Techniques') {
            const assignedTech = techSpecialtyMap.get(c.name);
            subjectsForClass = subjectsForClass.filter(s => {
                if (s.subject === 'Génie Électrique' || s.subject === 'Génie Mécanique') {
                    return s.subject === assignedTech;
                }
                return true;
            });
        }

        for (const subjectInfo of subjectsForClass) {
            const subject = subjectInfo.subject;
            let teachersForSubject: Teacher[];
            if (subject === 'Technologie' && (c.niveau === '1 annee' || c.niveau === '2 annee')) {
                teachersForSubject = mockTeachers.filter(t => t.specialty === 'Technologie' || t.specialty === 'Génie Mécanique' || t.specialty === 'Génie Électrique');
            } else {
                teachersForSubject = mockTeachers.filter(t => t.specialty === subject);
            }
            if (teachersForSubject.length === 0) continue;
            const totalHours = parseFloat(subjectInfo.hours) || 0;
            const availableTeachers = teachersForSubject.map(t => ({ name: `${t.firstName} ${t.lastName}`, load: teacherWorkload.get(`${t.firstName} ${t.lastName}`)! }));
            availableTeachers.sort((a, b) => a.load - b.load);
            const assignedTeacherName = availableTeachers[0].name;
            teacherAssignments.set(`${c.name}-${subject}`, assignedTeacherName);
            teacherWorkload.set(assignedTeacherName, (teacherWorkload.get(assignedTeacherName) || 0) + totalHours);
        }
    }

    // --- 2. Session Pre-computation Phase ---
    type Session = { class: Classe; subjectInfo: SubjectCoefficient; duration: number; };
    let fullClassSessions: Session[] = [];
    const groupSessionsByClass = new Map<string, Session[]>();
    const splitHoursIntoSessions = (totalHours: number): number[] => {
        if (totalHours <= 0) return [];
        const sessions: number[] = [];
        let remainingHours = totalHours;
        const validDurations = [2, 1.5, 1, 0.5];
        while (remainingHours > 0.01) {
            let found = false;
            for (const duration of validDurations) {
                if (remainingHours >= duration) {
                    sessions.push(duration);
                    remainingHours -= duration;
                    found = true;
                    break;
                }
            }
            if (!found) break;
        }
        return sessions.filter(s => s > 0);
    };
    for (const c of initialClasses) {
        let subjectsForClass = mockSubjectCoefficients.filter(s => s.level === c.niveau && s.specialization === c.specialite);
        
        // Filter tech subjects based on pre-assignment
        if (c.specialite === 'Sciences Techniques') {
            const assignedTech = techSpecialtyMap.get(c.name);
            subjectsForClass = subjectsForClass.filter(s => {
                if (s.subject === 'Génie Électrique' || s.subject === 'Génie Mécanique') {
                    return s.subject === assignedTech;
                }
                return true;
            });
        }

        groupSessionsByClass.set(c.name, []);
        for (const subjectInfo of subjectsForClass) {
            const totalHours = parseFloat(subjectInfo.hours) || 0;
            const groupHours = parseFloat(subjectInfo.groupHours || '0') || 0;
            const fullHours = totalHours - groupHours;
            splitHoursIntoSessions(fullHours).forEach(duration => fullClassSessions.push({ class: c, subjectInfo, duration }));
            splitHoursIntoSessions(groupHours).forEach(duration => groupSessionsByClass.get(c.name)!.push({ class: c, subjectInfo, duration }));
        }
    }

    // --- 3. Group Session Pairing for Alternation ---
    type ScheduleItem =
        | { type: 'full'; session: Session }
        | { type: 'paired_group'; session1: Session; session2: Session }
        | { type: 'single_group'; session: Session; group: 'GR1' | 'GR2' };
        
    const scheduleQueue: ScheduleItem[] = fullClassSessions.map(s => ({ type: 'full', session: s }));
    for (const sessions of groupSessionsByClass.values()) {
        const shuffledSessions = [...sessions].sort(() => Math.random() - 0.5);
        while (shuffledSessions.length > 0) {
            const session1 = shuffledSessions.pop()!;
            const pairIndex = shuffledSessions.findIndex(s => s.duration === session1.duration && s.subjectInfo.subject !== session1.subjectInfo.subject);
            if (pairIndex !== -1) {
                const session2 = shuffledSessions.splice(pairIndex, 1)[0];
                scheduleQueue.push({ type: 'paired_group', session1, session2 });
            } else {
                scheduleQueue.push({ type: 'single_group', session: session1, group: 'GR1' });
                scheduleQueue.push({ type: 'single_group', session: session1, group: 'GR2' });
            }
        }
    }
    
    // --- 4. Scheduling Phase ---
    const categorizedHalls = categorizeHalls(initialHalls);
    const addEvent = (details: Omit<TimetableEvent, 'id' | 'color'>) => {
        events.push({ ...details, id: String(eventId++), color: getSubjectColor(details.subject) });
    };

    // --- NEW: Hardness-based sorting ---
    const specialSubjects = Object.keys(categorizedHalls).filter(k => k !== 'general');
    const isSpecialized = (subject: string) => specialSubjects.includes(subject);

    const getHardness = (item: ScheduleItem): number => {
        if (item.type === 'paired_group') {
            const s1_spec = isSpecialized(item.session1.subjectInfo.subject);
            const s2_spec = isSpecialized(item.session2.subjectInfo.subject);
            if (s1_spec && s2_spec) return 5; // Hardest: two specialized rooms needed
            if (s1_spec || s2_spec) return 4; // Hard: one specialized room
            return 3; // Normal pair
        }
        if (item.type === 'single_group') {
            if (isSpecialized(item.session.subjectInfo.subject)) return 2; // single group needing specialized room
        }
        if (item.type === 'full') {
            if (isSpecialized(item.session.subjectInfo.subject)) return 1; // full class needing specialized room
        }
        return 0; // Easiest: full class, general room
    };

    scheduleQueue.sort((a, b) => {
        const hardnessA = getHardness(a);
        const hardnessB = getHardness(b);
        if (hardnessA !== hardnessB) {
            return hardnessB - hardnessA;
        }
        
        // If hardness is the same, sort by duration
        const getDuration = (item: ScheduleItem) => item.type === 'paired_group' ? item.session1.duration : item.session.duration;
        return getDuration(b) - getDuration(a);
    });

    const isOccupied = (type: 'teacher' | 'hall' | 'class', id: string, day: number, startM: number, endM: number): boolean => {
        return events.some(e => {
            if (e.day !== day) return false;
            const eventStartM = timeToMinutes(e.startTime);
            const eventEndM = timeToMinutes(e.endTime);

            if (startM < eventEndM && endM > eventStartM) { // Time overlap
                if (type === 'teacher' && e.teacher === id) return true;
                if (type === 'hall' && e.hall === id) return true;
                if (type === 'class') {
                    const placingIsGroup = id.includes(' GR');
                    const scheduledIsGroup = e.className.includes(' GR');
                    const placingBaseClass = id.split(' GR')[0];
                    const scheduledBaseClass = e.className.split(' GR')[0];

                    if (placingBaseClass !== scheduledBaseClass) return false; // Different class

                    // Conflict if:
                    // 1. Scheduled event is a full class.
                    if (!scheduledIsGroup) return true;
                    // 2. We are placing a full class.
                    if (!placingIsGroup) return true;
                    // 3. We are placing a group, and the scheduled event is for the same group.
                    if (placingIsGroup && scheduledIsGroup && id === e.className) return true;
                }
            }
            return false;
        });
    };

    const findAvailableHall = (subject: string, day: number, startM: number, endM: number, excludedHalls: string[] = []): string | null => {
        const hallTypeKey = Object.keys(categorizedHalls).find(k => k === subject);
        
        // Try specialized halls first, if applicable
        if (hallTypeKey && categorizedHalls[hallTypeKey]) {
            const potentialHalls = categorizedHalls[hallTypeKey];
            for (const hall of potentialHalls) {
                if (!excludedHalls.includes(hall) && !isOccupied('hall', hall, day, startM, endM)) {
                    return hall;
                }
            }
        }

        // If no specialized hall is found or needed, try general halls
        const generalHalls = categorizedHalls['general'];
        for (const hall of generalHalls) {
            if (!excludedHalls.includes(hall) && !isOccupied('hall', hall, day, startM, endM)) {
                return hall;
            }
        }

        return null; // No hall available
    };
    
    const restDays = new Map<string, number>();
    const workingDays = initialWorkingHours.filter(d => d.isWorkingDay).map(d => d.dayIndex);
    const classDayUsage = new Map<string, Set<string>>();

    const tryPlaceItem = (item: ScheduleItem, strictness: 'strict' | 'relaxed' | 'force'): boolean => {
        const daysToTry = [...workingDays].sort(() => Math.random() - 0.5);

        for (const day of daysToTry) {
            const daySlots = initialWorkingHours.find(d => d.dayIndex === day)!;

            if (item.type === 'full' || item.type === 'single_group') {
                const session = item.session;
                const durationM = session.duration * 60;
                const baseClassName = session.class.name;
                const eventClassName = item.type === 'full' ? baseClassName : `${baseClassName} ${item.group}`;
                const subject = session.subjectInfo.subject;
                const teacherKey = `${baseClassName}-${subject}`;
                const teacher = teacherAssignments.get(teacherKey)!;

                const restDayKey = teacher;
                if (!restDays.has(restDayKey)) restDays.set(restDayKey, workingDays[Math.floor(Math.random() * workingDays.length)]);
                if (strictness !== 'force' && day === restDays.get(restDayKey)!) continue;

                const usageKey = `${baseClassName}-${day}`;
                const subjectsOnDay = classDayUsage.get(usageKey) || new Set();
                if (strictness === 'strict' && subjectsOnDay.has(subject)) continue;

                const possibleStarts: number[] = [];
                if (daySlots.morningStart) for (let t = timeToMinutes(daySlots.morningStart); t <= timeToMinutes(daySlots.morningEnd) - durationM; t += 30) possibleStarts.push(t);
                if (daySlots.afternoonStart) for (let t = timeToMinutes(daySlots.afternoonStart); t <= timeToMinutes(daySlots.afternoonEnd) - durationM; t += 30) possibleStarts.push(t);

                for (const startM of possibleStarts.sort(() => Math.random() - 0.5)) {
                    const endM = startM + durationM;
                    if (isOccupied('class', eventClassName, day, startM, endM) || isOccupied('teacher', teacher, day, startM, endM)) continue;

                    const hall = findAvailableHall(subject, day, startM, endM);
                    if (hall) {
                        addEvent({ day, startTime: minutesToTimeStr(startM), endTime: minutesToTimeStr(endM), className: eventClassName, subject: subject, teacher, hall });
                        subjectsOnDay.add(subject);
                        classDayUsage.set(usageKey, subjectsOnDay);
                        return true;
                    }
                }
            } else if (item.type === 'paired_group') {
                const { session1, session2 } = item;
                const durationM = session1.duration * 60;
                const baseClassName = session1.class.name;
                const subject1 = session1.subjectInfo.subject;
                const subject2 = session2.subjectInfo.subject;
                const teacherKey1 = `${baseClassName}-${subject1}`;
                const teacherKey2 = `${baseClassName}-${subject2}`;
                const teacher1 = teacherAssignments.get(teacherKey1)!;
                const teacher2 = teacherAssignments.get(teacherKey2)!;

                if (!restDays.has(teacher1)) restDays.set(teacher1, workingDays[Math.floor(Math.random() * workingDays.length)]);
                if (!restDays.has(teacher2)) restDays.set(teacher2, workingDays[Math.floor(Math.random() * workingDays.length)]);
                if (strictness !== 'force' && (day === restDays.get(teacher1)! || day === restDays.get(teacher2)!)) continue;

                const usageKey = `${baseClassName}-${day}`;
                const subjectsOnDay = classDayUsage.get(usageKey) || new Set();
                if (strictness === 'strict' && (subjectsOnDay.has(subject1) || subjectsOnDay.has(subject2))) continue;
                
                const possibleStarts: number[] = [];
                if (daySlots.morningStart) for (let t = timeToMinutes(daySlots.morningStart); t <= timeToMinutes(daySlots.morningEnd) - durationM; t += 30) possibleStarts.push(t);
                if (daySlots.afternoonStart) for (let t = timeToMinutes(daySlots.afternoonStart); t <= timeToMinutes(daySlots.afternoonEnd) - durationM; t += 30) possibleStarts.push(t);

                for (const startM of possibleStarts.sort(() => Math.random() - 0.5)) {
                    const endM = startM + durationM;
                    if (isOccupied('class', baseClassName, day, startM, endM) || isOccupied('teacher', teacher1, day, startM, endM) || isOccupied('teacher', teacher2, day, startM, endM)) continue;

                    const hall1 = findAvailableHall(subject1, day, startM, endM);
                    if (!hall1) continue;
                    const hall2 = findAvailableHall(subject2, day, startM, endM, [hall1]);
                    if (hall2) {
                        addEvent({ day, startTime: minutesToTimeStr(startM), endTime: minutesToTimeStr(endM), className: `${baseClassName} GR1`, subject: subject1, teacher: teacher1, hall: hall1 });
                        addEvent({ day, startTime: minutesToTimeStr(startM), endTime: minutesToTimeStr(endM), className: `${baseClassName} GR2`, subject: subject2, teacher: teacher2, hall: hall2 });
                        subjectsOnDay.add(subject1);
                        subjectsOnDay.add(subject2);
                        classDayUsage.set(usageKey, subjectsOnDay);
                        return true;
                    }
                }
            }
        }
        return false;
    };
    
    for (const item of scheduleQueue) {
        let placed = tryPlaceItem(item, 'strict') || tryPlaceItem(item, 'relaxed') || tryPlaceItem(item, 'force');
        if (!placed) {
            // We log the item that couldn't be placed for easier debugging.
            console.error("FATAL: Could not place schedule item. Check constraints and resources.", JSON.stringify(item, null, 2));
        }
    }

    return events;
};

export const mockEvents: TimetableEvent[] = generateFullTimetable();