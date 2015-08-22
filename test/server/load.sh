#!/bin/bash

for i in {1..100}; do
  curl -H "Content-Type: application/json" -X POST -d '{"fouroData" : {"username" : "'$i'@uoregon.edu", "password" : "jordan", "school" : "University of Oregon"}}' http://fouro-env.elasticbeanstalk.com/users/create
  
done
