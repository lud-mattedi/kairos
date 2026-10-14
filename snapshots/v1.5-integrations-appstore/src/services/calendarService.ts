import type { Demand } from '../types';

export const calendarService = {
  exportToICS(demands: Demand[]): void {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    const scheduled = demands.filter(d => d.status === 'HOJE' || d.scheduledTime);
    if (scheduled.length === 0) {
      alert('Nenhuma demanda agendada para hoje para exportar.');
      return;
    }

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//KAIROS OS//TimeBlocking//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH'
    ];

    scheduled.forEach((d, index) => {
      const startHour = 8 + index * 2;
      const startHourStr = startHour.toString().padStart(2, '0');
      const endHourStr = (startHour + 1).toString().padStart(2, '0');

      icsContent.push('BEGIN:VEVENT');
      icsContent.push(`UID:kairos-${d.id}-${Date.now()}@kairos.os`);
      icsContent.push(`DTSTAMP:${dateStr}T120000Z`);
      icsContent.push(`DTSTART:${dateStr}T${startHourStr}0000Z`);
      icsContent.push(`DTEND:${dateStr}T${endHourStr}0000Z`);
      icsContent.push(`SUMMARY:[KAIROS] ${d.title}`);
      icsContent.push(`DESCRIPTION:Próxima Ação: ${d.nextAction}\\nCritério de Pronto: ${d.definitionOfDone}\\nCusto do Atraso: ${d.costOfDelay}`);
      icsContent.push(`STATUS:CONFIRMED`);
      icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `kairos-agenda-${dateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
