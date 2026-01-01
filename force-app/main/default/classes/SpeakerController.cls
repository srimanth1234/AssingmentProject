public with sharing class SpeakerController {


    @AuraEnabled(cacheable=true)
    public static List<Speaker__c> searchSpeakers(String name, String speciality) {

        String query =
            'SELECT Id, Name, Email__c, Bio__c, Speciality_c__c ' +
            'FROM Speaker__c WHERE Id != null';

        if (String.isNotBlank(name)) {
            query += ' AND Name LIKE \'%' + String.escapeSingleQuotes(name) + '%\'';
        }

        if (String.isNotBlank(speciality)) {
            query += ' AND Speciality_c__c = \'' + String.escapeSingleQuotes(speciality) + '\'';
        }

        return Database.query(query);
    }

  
    @AuraEnabled(cacheable=true)
    public static Speaker__c getSpeakerById(Id speakerId) {
        return [
            SELECT Id, Name, Bio__c,Speciality_c__c
            FROM Speaker__c
            WHERE Id = :speakerId
            LIMIT 1
        ];
    }

    
    @AuraEnabled(cacheable=true)
    public static Boolean checkAvailability(Id speakerId, Date sessionDate) {

        Integer countAssignments = [
            SELECT COUNT()
            FROM Speaker_Assignment__c
            WHERE Speaker__c = :speakerId
            AND Session__r.Session_Date__c = :sessionDate
        ];

        return countAssignments == 0;
    }

    
    @AuraEnabled
    public static void createAssignment(Id speakerId, Date sessionDate) {
        Id sessionId = getSessionForDate(sessionDate);
        Speaker_Assignment__c sa = new Speaker_Assignment__c(
            Name='Speakers',
            Speaker__c = speakerId,
            Session__c = sessionId
        );

        insert sa;
    }
    @AuraEnabled
public static Id getSessionForDate(Date sessionDate) {
   List<Session__c> sessions = [
        SELECT Id
        FROM Session__c
        WHERE Session_Date__c = :sessionDate
        LIMIT 1
    ];
           
    if (!sessions.isEmpty()) {
        return sessions[0].Id;
    }

    
    Session__c newSession = new Session__c(
        Title__c = 'Auto Session - ' + sessionDate,
        Session_Date__c = sessionDate,
        Start_Time_c__c = Time.newInstance(10, 0, 0, 0),
        End_Time_c__c = Time.newInstance(11, 0, 0, 0),
        Level__c = 'Beginner'
    );

    insert newSession;
    return newSession.Id;
}
    
    @AuraEnabled(cacheable=true)
public static List<String> getBookedDates(Id speakerId) {

    List<String> bookedDates = new List<String>();

    for (AggregateResult ar : [
        SELECT Session__r.Session_Date__c d
        FROM Speaker_Assignment__c
        WHERE Speaker__c = :speakerId
        GROUP BY Session__r.Session_Date__c
    ]) {
        bookedDates.add(String.valueOf(ar.get('d')));
    }

    return bookedDates;
}

}