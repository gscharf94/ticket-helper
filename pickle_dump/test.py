import pickle

response_dict = pickle.load(open('r2020-07-14.p','rb'))

for work_id_num in response_dict:
	for ticket_num in response_dict[work_id_num]:
		for x, row in enumerate(response_dict[work_id_num][ticket_num]):
			for y, item in enumerate(row):
				response_dict[work_id_num][ticket_num][x][y] = item.replace(",","")

test_work_id = response_dict['231']

print(test_work_id)