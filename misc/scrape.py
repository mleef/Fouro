import bs4
import requests


response = requests.get('http://uocatalog.uoregon.edu/genedcourses/')
soup = bs4.BeautifulSoup(response.text)


classes = soup.find_all('td');

first = True;
badRow = False;
classDict = {};

for row in classes:
	value = row.string.encode('ascii','replace').replace('?', ' ');
	if(not badRow):
		if(first):
			split = value.split(' ');
			print '7' + '\t' + split[0] + '\t' + split[1] + '\t',
			first = False
		else:
			print value + '\t',;
			first = True
			badRow = True;
	else:
		print 'University of Oregon'
		badRow = False;

	
