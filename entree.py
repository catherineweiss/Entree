#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jan 18 12:13:26 2020

@author: dan
"""

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import spacy
import sys

    



def init_database_and_nlp():
    """ Initializes firebase database connection and loads spacy medium NLP
        module.
        
        Returns: spacy NLP object
    """
    cred = credentials.Certificate('service_account_credentials.json')
    firebase_admin.initialize_app(cred, {'databaseURL' : 'https://entreehackathon.firebaseio.com'})
    nlp = spacy.load("en_core_web_md")
    return nlp



def init_database():
    """ Just initializes firebase database connection; does NOT load spacy NLP
        module.
    """
    cred = credentials.Certificate('service_account_credentials.json')
    firebase_admin.initialize_app(cred, {'databaseURL' : 'https://entreehackathon.firebaseio.com'})
    



def gen_and_save_scores(nlp):
    """ Generates scores for all possible matches and saves them to the
        firebase database.  IMPORTANT: Overwrites match data if it is already
        in the database.
    """
    score_dict_raw, score_dict_formatted = gen_scores(nlp)
    save_scores(score_dict_raw)




def make_and_save_matches(week=1, algorithm=2):
    """ Generates matches, populates emailLineup, and then updates the
        preference table by setting match score for the match that was made to
        -100 (so it does not happen again).
    """
    if algorithm == 1: matches, totalScore, no_matches = make_matches1()
    elif algorithm == 2: matches, totalScore, no_matches = make_matches2()
    else: 
        print("Invalid algorithm.")
        return
    save_matches_update_preferences(matches, week)




def clear_emailLineup():
    """ Deletes all emailLineup data.  Used for development and debugging.
    """
    email_list = db.reference('emailLineup')
    email_list.set({})
    








def gen_scores(nlp):

    # Declare score matrix dictionary - this will store all match scores
    score_dict_raw = {}
    
    # Load all data from intake_data database
    data = db.reference().get()['register']
    
    # Loop through all entries in the intake_data; key1 is the person for
    # whom we are evaluating matches
    for key1 in data:
        match_dict = {}

        # Loop through all entries in the intake_data; key2 is the second person
        for key2 in data:
            if key1 == key2: continue # Skip when person1 == person2
            match_dict[key2] = score_match(key1, key2, data, nlp)

        score_dict_raw[key1] = match_dict

    score_dict_formatted = format_score_dict(score_dict_raw, data)

    return score_dict_raw, score_dict_formatted





def score_match(key1, key2, data, nlp):
    """ Scores a potential match between two people.
        key1 is the ID of person1
        key2 is the ID of person2
        data is the dictionary with all data from intake_data
        nlp is a spaCy nlp object (returned by the init function)
        
        Current Methodology:
            Same Movie: +10
            Each Same Interest: +5
            City Similarity: up to 10, based on spaCy similarity analysis
    
        RETURNS the numerical score for the match
    """

    # Initialize variable to hold the score for the match
    score = 0

    # Get the intake data for person1 and person2
    p1 = data[key1]
    p2 = data[key2]

    # Add 10 to score if movies are the same
    if p1['movie'] == p2['movie']: score += 10

    # Add 5 to score for each interest that is the same
    interest_list_1 = [p1['interest1'].lower(), p1['interest2'].lower(), p1['interest3'].lower()]
    interest_list_2 = [p2['interest1'].lower(), p2['interest2'].lower(), p2['interest3'].lower()]
    for interest in interest_list_1:
        if interest in interest_list_2: score += 5

    # Get city similarity using spaCy word vectors
    city1 = nlp(p1['cities'])
    city2 = nlp(p2['cities'])
    city_sim = city1.similarity(city2)
    score += 10 * city_sim

    # Scale to be out of 100
    score = score / 35 * 100

    return score





def save_scores(score_dict_raw):
    ref = db.reference('pref-table')
    for key in score_dict_raw:
        ref.child(key).set(score_dict_raw[key])    
    return True





def load_scores():
    return db.reference().get()['pref-table']





def format_score_dict(score_dict, data):
    newdict = {}
    for key1 in score_dict:
        name1 = data[key1]['firstName'] + ' ' + data[key1]['lastName']
        match_dict = score_dict[key1]
        match_list = []
        for key2 in match_dict:
            name2 = data[key2]['firstName'] + ' ' + data[key2]['lastName']
            match_list.append((name2, match_dict[key2]))
        match_list = sorted(match_list, key=lambda x: x[1], reverse=True)
        newdict[name1] = match_list
    return newdict





def make_matches1():

    scores = load_scores()
    already_matched = []
    matches = []
    no_matches = []
    totalScore = 0

    # Loop through 
    for key in scores:
        if key in already_matched: continue

        maxScore = -500
        for key2 in scores[key]:
            if key2 in already_matched: continue
            if scores[key][key2] > maxScore: 
                maxScore = scores[key][key2]
                matchID = key2

        # If there is no match, add to the no_matches list and move on to the
        # next iteration.
        if maxScore < 0:
            no_matches.append(key)
            continue

        already_matched.append(key)
        already_matched.append(matchID)

        matches.append((key, matchID, maxScore))
        
        totalScore += maxScore

    matches_formatted = format_matches(matches)

    print("Number of matches:", len(matches_formatted))
    print("Total match score:", totalScore)
    if len(matches_formatted) > 0: average = totalScore / len(matches_formatted)
    else: average = 0
    print("Average match score:", average)

    return matches_formatted, totalScore, no_matches





def make_matches2():

    scores = load_scores()
    all_scores = []
    already_matched = []
    totalScore = 0
    matches = []
    no_matches = []

    for key1 in scores:
        for key2 in scores[key1]:
            all_scores.append((scores[key1][key2], key1, key2))

    all_scores = sorted(all_scores, reverse=True)

    for row in all_scores:

        if (row[1] in already_matched) or (row[2] in already_matched): continue

        # If the match score is below zero, do not add the match
        if row[0] < 0:
            no_matches.append(row[1])
            continue
    
        matches.append((row[1], row[2], row[0]))
        already_matched.append(row[1])
        already_matched.append(row[2])
        totalScore += row[0]

    matches_formatted = format_matches(matches)

    print("Number of matches:", len(matches_formatted))
    print("Total match score:", totalScore)
    if len(matches_formatted) > 0: average = totalScore / len(matches_formatted)
    else: average = 0
    print("Average match score:", average)

    return matches_formatted, totalScore, []





def save_matches_update_preferences(matches, week):
    email_list = db.reference('emailLineup')
    pref_table = db.reference('pref-table')
    email_data = email_list.get()
    if email_data == None: next_num = 1
    else: next_num = len(email_data)
    for match in matches:
        email_list.child(str(next_num)).set({'id1':match[0], 'name1':match[1], 'email1':match[2], 'id2':match[3], 'name2':match[4], 'email2':match[5], 'week':week})
        pref_table.child(match[0]).child(match[3]).set(-100)
        pref_table.child(match[3]).child(match[0]).set(-100)
        next_num += 1





def format_matches(match_list):
    data = db.reference().get()['register']
    new_list = []
    for item in match_list:
        id1 = item[0]
        id2 = item[1]
        name1 = data[item[0]]['firstName'] + ' ' +data[item[0]]['lastName']
        name2 = data[item[1]]['firstName'] + ' ' +data[item[1]]['lastName']
        email1 = data[item[0]]['email']
        email2 = data[item[1]]['email']
        new_list.append((id1, name1, email1, id2, name2, email2))
    return new_list





if __name__ == "__main__":
    
    if len(sys.argv) < 2:
        print("Error: Usage: python entree.py <COMMAND>")
        command = 'none'
    else: command = sys.argv[1]


    if command == 'none':
        pass

    elif command.lower() == 'genscores':
        nlp = init_database_and_nlp()
        gen_and_save_scores(nlp)

    elif command.lower() == 'makematches':
        if len(sys.argv) < 3:
            print("Error: Usage: python entree.py makematches <WEEK>")
        else:
            week = int(sys.argv[2])
            init_database()
            make_and_save_matches(week, 2)

    elif command.lower() == 'clearemails':
        init_database()
        clear_emailLineup()

    else:
        print("Error: invalid command.  Valid commands are 'genscores', 'makematches', and 'clearemails'")

