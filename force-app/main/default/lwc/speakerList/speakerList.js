import { LightningElement, api, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import SPEAKER_CHANNEL from '@salesforce/messageChannel/SpeakerSelected__c';

export default class SpeakerList extends LightningElement {
    @api speakers;

    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Speciality', fieldName: 'Speciality_c__c' },
        {
            type: 'button',
            typeAttributes: {
                label: 'Book Session',
                name: 'book',
                variant: 'brand'
            }
        }
    ];

    @wire(MessageContext)
    messageContext;

    handleRowAction(event) {
        const speakerId = event.detail.row.Id;

        publish(this.messageContext, SPEAKER_CHANNEL, {
            speakerId: speakerId
        });
    }
}
