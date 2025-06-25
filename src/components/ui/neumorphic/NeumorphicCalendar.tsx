'use client';

import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventApi, EventInput } from '@fullcalendar/core';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export interface NeumorphicCalendarProps {
  events: EventInput[];
  onEventClick?: (event: EventApi) => void;
  height?: string | number;
  className?: string;
  initialDate?: Date;
  headerToolbar?: {
    left?: string;
    center?: string;
    right?: string;
  };
}

export function NeumorphicCalendar({
  events,
  onEventClick,
  height = 'auto',
  className,
  initialDate,
  headerToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth'
  }
}: NeumorphicCalendarProps) {
  const { theme } = useTheme();
  const calendarRef = useRef<FullCalendar>(null);

  // Apply neumorphic theme styles to FullCalendar
  useEffect(() => {
    // Theme styles are applied via CSS classes on the wrapper
    // FullCalendar will inherit the theme through CSS variables
  }, [theme]);

  return (
    <div className={cn(
      'neumorphic-calendar-wrapper',
      'bg-neumorphic-card-gradient',
      'border border-neumorphic-border/20',
      'rounded-neumorphic-lg',
      'shadow-neumorphic-convex',
      'p-4',
      className
    )}>
      <style jsx global>{`
        /* NeumorphicCalendar Theme Integration */
        .neumorphic-calendar {
          font-family: var(--font-inter), system-ui, sans-serif;
          background: var(--neumorphic-card);
          border-radius: var(--neumorphic-radius-lg);
        }

        /* Header styling */
        .neumorphic-calendar .fc-header-toolbar {
          background: var(--neumorphic-card-gradient);
          border: 1px solid var(--neumorphic-border);
          border-radius: var(--neumorphic-radius-md);
          padding: var(--neumorphic-spacing-sm);
          margin-bottom: var(--neumorphic-spacing-md);
          box-shadow: var(--neumorphic-shadow-inset-sm);
        }

        .neumorphic-calendar .fc-toolbar-title {
          color: var(--neumorphic-text-primary);
          font-weight: 600;
          font-size: 1.125rem;
        }

        /* Button styling */
        .neumorphic-calendar .fc-button {
          background: var(--neumorphic-card-gradient);
          border: 1px solid var(--neumorphic-border);
          border-radius: var(--neumorphic-radius-sm);
          color: var(--neumorphic-text-primary);
          box-shadow: var(--neumorphic-shadow-convex-sm);
          padding: var(--neumorphic-spacing-xs) var(--neumorphic-spacing-sm);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .neumorphic-calendar .fc-button:hover:not(:disabled) {
          box-shadow: var(--neumorphic-shadow-inset-sm);
          transform: translateY(1px);
        }

        .neumorphic-calendar .fc-button:active {
          box-shadow: var(--neumorphic-shadow-inset-md);
          transform: translateY(2px);
        }

        .neumorphic-calendar .fc-button-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .neumorphic-calendar .fc-button-active {
          background: var(--neumorphic-accent);
          color: white;
          box-shadow: var(--neumorphic-shadow-inset-sm);
        }

        /* Table styling */
        .neumorphic-calendar .fc-scrollgrid {
          border: none;
        }

        .neumorphic-calendar .fc-theme-standard th {
          background: var(--neumorphic-card-gradient);
          border: 1px solid var(--neumorphic-border);
          color: var(--neumorphic-text-secondary);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: var(--neumorphic-spacing-sm);
        }

        .neumorphic-calendar .fc-theme-standard td {
          border: 1px solid var(--neumorphic-border);
          background: var(--neumorphic-background);
        }

        .neumorphic-calendar .fc-daygrid-day {
          background: var(--neumorphic-background);
          transition: background-color 0.2s ease;
        }

        .neumorphic-calendar .fc-daygrid-day:hover {
          background: var(--neumorphic-card);
        }

        .neumorphic-calendar .fc-daygrid-day-top {
          color: var(--neumorphic-text-primary);
          font-weight: 500;
          padding: var(--neumorphic-spacing-xs);
        }

        .neumorphic-calendar .fc-day-today {
          background: var(--neumorphic-accent-subtle) !important;
        }

        .neumorphic-calendar .fc-day-today .fc-daygrid-day-number {
          background: var(--neumorphic-accent);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2px;
          font-weight: 600;
        }

        /* Event styling */
        .neumorphic-calendar .fc-event {
          border-radius: var(--neumorphic-radius-sm);
          border: none;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 2px 6px;
          margin: 1px 0;
          box-shadow: var(--neumorphic-shadow-convex-xs);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .neumorphic-calendar .fc-event:hover {
          box-shadow: var(--neumorphic-shadow-convex-sm);
          transform: translateY(-1px);
        }

        .neumorphic-calendar .fc-event .fc-event-title {
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Dark theme adjustments */
        .neumorphic-calendar.dark .fc-theme-standard th {
          background: var(--neumorphic-card-dark);
        }

        .neumorphic-calendar.dark .fc-theme-standard td {
          background: var(--neumorphic-background-dark);
        }

        .neumorphic-calendar.dark .fc-daygrid-day {
          background: var(--neumorphic-background-dark);
        }

        .neumorphic-calendar.dark .fc-daygrid-day:hover {
          background: var(--neumorphic-card-dark);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .neumorphic-calendar .fc-toolbar {
            flex-direction: column;
            gap: var(--neumorphic-spacing-sm);
          }

          .neumorphic-calendar .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
          }

          .neumorphic-calendar .fc-button {
            padding: var(--neumorphic-spacing-xs);
            font-size: 0.75rem;
          }

          .neumorphic-calendar .fc-event {
            font-size: 0.625rem;
            padding: 1px 4px;
          }
        }
      `}</style>
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={initialDate}
        headerToolbar={headerToolbar}
        events={events}
        eventClick={(info) => {
          info.jsEvent.preventDefault();
          if (onEventClick) {
            onEventClick(info.event);
          }
        }}

        height={height}
        dayMaxEvents={3}
        moreLinkClick="popover"
        eventDisplay="block"
        displayEventTime={false}
        fixedWeekCount={false}
        showNonCurrentDates={false}
        aspectRatio={1.35}
      />
    </div>
  );
} 