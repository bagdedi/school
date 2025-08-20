import React from 'react';
import type { TimetableEvent, DayWorkingHours } from '../../types';

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

interface EventBodyProps {
  event: TimetableEvent;
  displayMode?: 'student' | 'teacher' | 'hall';
}

const EventBody: React.FC<EventBodyProps> = ({ event, displayMode }) => {
    if (displayMode === 'teacher') {
        return (
            <>
                <strong className="font-semibold truncate">{event.className}</strong>
                <strong className="font-medium truncate">{event.hall}</strong>
            </>
        )
    }

    const isGroup = event.className.includes(' GR');
    const groupName = isGroup ? event.className.split(' ').pop() : '';
    const subjectText = isGroup ? `${event.subject} (${groupName})` : event.subject;
    const classNameText = isGroup ? event.className.split(' GR')[0] : event.className;

    return (
        <>
            {displayMode !== 'student' && <strong className="font-semibold truncate">{classNameText}</strong>}
            <span className="truncate">{subjectText}</span>
            <span className="opacity-80 truncate">{event.teacher}</span>
            {displayMode !== 'hall' && <strong className="font-medium truncate">{event.hall}</strong>}
        </>
    );
};


export const Timetable: React.FC<{ events: TimetableEvent[], workingHours: DayWorkingHours[], displayMode?: 'student' | 'teacher' | 'hall' }> = ({ events, workingHours, displayMode = 'teacher' }) => {
  const slotDuration = 60; // 60-minute slots

  const activeDays = workingHours
    .filter(d => d.isWorkingDay)
    .sort((a, b) => a.dayIndex - b.dayIndex);

  if (activeDays.length === 0) {
    return <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">Aucun horaire de travail n'a été configuré.</div>;
  }

  const allTimes = activeDays.flatMap(d => [d.morningStart, d.morningEnd, d.afternoonStart, d.afternoonEnd]).filter(Boolean);

  if (allTimes.length === 0) {
    return <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">Veuillez définir les heures de travail pour les jours actifs.</div>;
  }

  const minMinutes = Math.min(...allTimes.map(timeToMinutes));
  const maxMinutes = Math.max(...allTimes.map(timeToMinutes));

  const gridStartMinutes = Math.floor(minMinutes / slotDuration) * slotDuration;
  const gridEndMinutes = Math.ceil(maxMinutes / slotDuration) * slotDuration;

  const timeSlots: number[] = [];
  for (let m = gridStartMinutes; m < gridEndMinutes; m += slotDuration) {
    timeSlots.push(m);
  }

  const displayedEvents = events.filter(event =>
    workingHours.find(day => day.dayIndex === event.day)?.isWorkingDay
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
      <div
        className="grid relative timetable-grid"
        style={{
          gridTemplateColumns: `100px repeat(${timeSlots.length}, minmax(100px, 1fr))`,
          gridTemplateRows: `auto repeat(${activeDays.length}, minmax(60px, auto))`,
          '--time-slot-count': timeSlots.length,
        } as React.CSSProperties}
      >
        {/* Top-left corner */}
        <div className="sticky left-0 top-0 z-30 bg-gray-50 border-b border-r border-gray-200"></div>

        {/* Time Header */}
        {timeSlots.map(minutes => (
          <div key={minutes} className="text-center py-2 px-1 text-xs font-semibold border-b border-r border-gray-200 text-gray-600 bg-gray-50 top-0 z-20 timetable-grid-header">
            {minutesToTimeStr(minutes)}
          </div>
        ))}

        {/* Day Rows, Breaks, and Events */}
        {activeDays.map((day, dayIndex) => {
            const dayRow = dayIndex + 2; // CSS grid is 1-indexed, +1 for header row
            const dayEvents = displayedEvents.filter(e => e.day === day.dayIndex);
            const processedEventIds = new Set<string>();
            
            return (
                <React.Fragment key={day.dayIndex}>
                    {/* Day Label */}
                    <div className="sticky left-0 z-20 text-center py-2 px-1 text-sm font-semibold border-b border-r border-gray-200 bg-blue-50 text-blue-700 flex items-center justify-center timetable-grid-day-label">
                        {day.day}
                    </div>

                    {/* Grid cells for this day (including breaks) */}
                    {timeSlots.map((slotMinutes, slotIndex) => {
                        const slotStart = slotMinutes;
                        const slotEnd = slotMinutes + slotDuration;
                        const morningStart = timeToMinutes(day.morningStart);
                        const morningEnd = timeToMinutes(day.morningEnd);
                        const afternoonStart = timeToMinutes(day.afternoonStart);
                        const afternoonEnd = timeToMinutes(day.afternoonEnd);
                        
                        let isWorkingSlot = false;
                        if (day.morningStart && day.morningEnd) {
                            if (slotStart >= morningStart && slotEnd <= morningEnd) isWorkingSlot = true;
                        }
                        if (day.afternoonStart && day.afternoonEnd) {
                            if (slotStart >= afternoonStart && slotEnd <= afternoonEnd) isWorkingSlot = true;
                        }

                        return (
                            <div
                                key={`${day.dayIndex}-${slotMinutes}`}
                                className={`border-b border-r border-gray-200 ${!isWorkingSlot ? 'bg-gray-100 break-slot' : ''}`}
                                style={{
                                    gridRow: dayRow,
                                    gridColumn: slotIndex + 2,
                                }}
                            ></div>
                        );
                    })}

                    {/* Events for this day */}
                    {dayEvents.map(event => {
                        if (processedEventIds.has(event.id)) return null;

                        const baseClassName = event.className.split(' GR')[0];
                        const isGroup = event.className.includes(' GR');

                        const pair = displayMode === 'student' && isGroup
                            ? dayEvents.find(e =>
                                e.id !== event.id &&
                                !processedEventIds.has(e.id) &&
                                e.className.split(' GR')[0] === baseClassName &&
                                e.startTime === event.startTime &&
                                e.endTime === event.endTime &&
                                e.className !== event.className
                            )
                            : null;
                        
                        const startMinutes = timeToMinutes(event.startTime);
                        const endMinutes = timeToMinutes(event.endTime);
                        const startOffset = startMinutes - gridStartMinutes;
                        const endOffset = endMinutes - gridStartMinutes;
                        if (endMinutes <= gridStartMinutes || startMinutes >= gridEndMinutes) return null;
                        const colStart = Math.floor(startOffset / slotDuration) + 2;
                        const colEnd = Math.floor(endOffset / slotDuration) + 2;
                        const clampedColStart = Math.max(2, colStart);
                        const clampedColEnd = Math.min(timeSlots.length + 2, colEnd);
                        if (clampedColStart >= clampedColEnd) return null;
                        
                        const gridPosition = {
                            gridRow: dayRow,
                            gridColumn: `${clampedColStart} / ${clampedColEnd}`,
                        };

                        if (pair) {
                            processedEventIds.add(event.id);
                            processedEventIds.add(pair.id);

                            const event1 = event.className.endsWith('GR1') ? event : pair;
                            const event2 = event.className.endsWith('GR2') ? event : pair;
                            
                            return (
                                <div key={event.id} style={gridPosition} className="flex flex-col m-1 rounded-md overflow-hidden z-10 p-0 shadow-sm timetable-grid-event">
                                    <div className={`h-1/2 p-1 text-xs leading-tight flex flex-col justify-center border-b border-white/30 ${event1.color}`}>
                                        <EventBody event={event1} displayMode={displayMode} />
                                    </div>
                                    <div className={`h-1/2 p-1 text-xs leading-tight flex flex-col justify-center ${event2.color}`}>
                                        <EventBody event={event2} displayMode={displayMode} />
                                    </div>
                                </div>
                            )
                        } else {
                            processedEventIds.add(event.id);
                            return (
                                <div
                                    key={event.id}
                                    className={`p-1 text-xs leading-tight rounded-md border m-1 flex flex-col justify-center overflow-hidden z-10 ${event.color} timetable-grid-event`}
                                    style={gridPosition}
                                >
                                    <EventBody event={event} displayMode={displayMode} />
                                </div>
                            );
                        }
                    })}
                </React.Fragment>
            );
        })}
      </div>
    </div>
  );
};
