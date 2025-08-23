import type { DisciplineCouncilMeeting } from '../../types';

export const mockCouncilMeetings: DisciplineCouncilMeeting[] = [
    {
        id: 'M001',
        studentId: 'S0002',
        referralIncidentId: 'D006',
        meetingDate: '2025-10-25',
        status: 'Completed',
        membersPresent: [
            "Dr. Helmi Ahmed EL KAMEL (Président)",
            "Ali Mansouri (Censeur)",
            "Salma Zouari (Conseiller Principal)",
            "Karim Ben Ali (Enseignant Élu)",
            "Salma Mansouri (Enseignant Élu)",
            "Nour Guesmi (Représentant des Parents)"
        ],
        discussionSummary: "L'étudiant a reconnu son comportement inapproprié envers l'enseignant. Il a exprimé des remords. Le conseil a pris en compte son dossier antérieur sans incident majeur.",
        decision: 'Exclusion Temporaire',
        decisionIncidentId: 'D006' // In a real case, this would point to a new incident, but for mock, we reuse.
    },
    {
        id: 'M002',
        studentId: 'S0006',
        referralIncidentId: 'D013', // Assuming a referral incident was created
        meetingDate: '2025-12-05',
        status: 'Scheduled',
    },
];
