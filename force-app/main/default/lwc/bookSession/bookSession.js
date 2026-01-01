import { LightningElement, wire, track } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import SPEAKER_CHANNEL from '@salesforce/messageChannel/SpeakerSelected__c';
import getSpeakerById from '@salesforce/apex/SpeakerController.getSpeakerById';
import createAssignment from '@salesforce/apex/SpeakerController.createAssignment';

export default class BookSession extends LightningElement {

    speakerId;
    selectedDate;
    disabled = true;

    @track speaker;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        subscribe(this.messageContext, SPEAKER_CHANNEL, (msg) => {
            console.log('LMS MESSAGE RECEIVED:', msg);
            this.speakerId = msg.speakerId;
            this.loadSpeaker();
        });
    }

    loadSpeaker() {
        getSpeakerById({ speakerId: this.speakerId })
            .then(result => {
                this.speaker = result;
                this.disabled = true;
            })
            .catch(error => {
                console.error('Error loading speaker:', error);
            });
    }

    handleDate(event) {
        this.selectedDate = event.target.value;

        const today = new Date().toISOString().split('T')[0];
        if (this.selectedDate <= today) {
            this.disabled = true;
            this.showToast(
                'Invalid Date',
                'Please select a future date',
                'error'
            );
            return;
        }

        // Do NOT block by date
        this.disabled = false;
    }

    createAssignment() {
        createAssignment({
            speakerId: this.speakerId,
            sessionDate: this.selectedDate
        })
        .then(() => {
            this.disabled = true;
            this.showToast(
                'Success',
                'Speaker assigned successfully',
                'success'
            );
        })
        .catch(error => {
            console.error('Create Assignment Error:', error);

            const message =
                error?.body?.message || 'Assignment failed';

            this.showToast(
                'Error',
                message,
                'error'
            );
        });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}