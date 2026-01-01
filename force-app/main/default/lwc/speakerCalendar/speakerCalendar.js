import { LightningElement, api, track } from 'lwc';
import getBookedDates from '@salesforce/apex/SpeakerController.getBookedDates';

export default class SpeakerCalendar extends LightningElement {

    @api speakerId;
    @track days = [];

    connectedCallback() {
        this.loadCalendar();
    }

    async loadCalendar() {
    const booked = await getBookedDates({ speakerId: this._speakerId });

    const bookedSet = new Set(booked); // ['2026-01-10', ...]

    const today = new Date();
    this.days = [];

    for (let i = 1; i <= 14; i++) {
        const d = new Date();
        d.setDate(today.getDate() + i);

        const iso = d.toISOString().split('T')[0];

        this.days.push({
            date: iso,
            label: d.getDate(),
             className: `day ${bookedSet.has(iso) ? 'booked' : 'available'}`
        });
    }
}

    handleSelect(event) {
        if (event.target.classList.contains('booked')) return;

        this.dispatchEvent(
            new CustomEvent('dateselect', {
                detail: event.target.dataset.date
            })
        );
    }
}
