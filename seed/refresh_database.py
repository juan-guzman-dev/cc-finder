import requests, json
from keys import ccstack_API_SECRET_KEY

from flask import Flask
from models import db, connect_db, SignupBonus, RewardRate
from raw_card_data_from_API import data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///capstone_one'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

connect_db(app)


ccstack_API_BASE_URL = "https://api.ccstack.io/v1"


# ********************************************************************************
# Retrieve data API to seed 'banks' table in db
# ********************************************************************************
# data = requests.get(f"{ccstack_API_BASE_URL}/discover/banks?api_key={ccstack_API_SECRET_KEY}").json()
# banks = data["results"]
# for page in range(2, data["total_pages"]+1):
#     data = requests.get(f"{ccstack_API_BASE_URL}/discover/banks?api_key={ccstack_API_SECRET_KEY}&page={page}").json()
#     banks.extend(data["results"])

# replace='~~~'  # in the seed file, will find ", '~', '~', '~')" and replace with a trailing comma and close parenthesis ",)" 

# for bank in banks:
#     print(
#         (
#             bank['_id'], 
#             bank['name'], 
#             bank['full_name'], 
#             bank['address'], 
#             bank['insurance_type'], 
#             bank['insurance_id'], 
#             bank['website']
#             )+tuple(replace)
#             )

# ********************************************************************************
# Retrieve data from API to seed 'earning_categories' table in db
# ********************************************************************************
# earning_categories = requests.get(f"{ccstack_API_BASE_URL}/lists/categories?api_key={ccstack_API_SECRET_KEY}").json()

# for category in earning_categories:
#     print(
#         (
#             category['id'],
#             category['name'] 
#             )
#             )


# ********************************************************************************
# Retrieve data from API to seed 'reward_types' table in db
# ********************************************************************************
# reward_types = requests.get(f"{ccstack_API_BASE_URL}/lists/types?api_key={ccstack_API_SECRET_KEY}").json()

# for _type in reward_types:
#     print(
#         (
#             _type['id'],
#             _type['name'] 
#             )
#             )


# ***************************************************************
# Retrieve data from raw_card_data_from_API to seed 'signup_bonus' table in db
# ***************************************************************
# cards = data["results"]

# bonus_list = []

# for card in cards:
#     bonus_list.append(card['bonus'])

# unique_bonuses = list(map(json.loads,set(map(json.dumps, bonus_list))))

# for bonus in unique_bonuses:
#     print(tuple(bonus.values()))


# ********************************************************************************
# Retrieve data from raw_card_data_from_API to seed 'reward_rates' table in db
# ********************************************************************************
# cards = data["results"]

# reward_rates = []

# for card in cards:
#     rates=card['earnings']
#     for rate in rates:
#         rate.pop('category')
#         reward_rates.append(rate)

# unique_rates = list(map(json.loads,set(map(json.dumps, reward_rates))))

# replace='~~~'  # in the seed file, will find ", '~', '~', '~')" and replace with a trailing comma and close parenthesis ",)" 

# for rate in unique_rates:
#     print(tuple(rate.values())+tuple(replace))


# ********************************************************************************
# Retrieve data from raw_card_data_from_API to seed 'product_details' table in db
# ********************************************************************************
# cards = data["results"]

# lst = []

# for card in cards:
#   for r in card['rewards']:
#     item=(card['_id'], r['title'])
#     lst.append(item)

# replace='~~~'  # in the seed file, will find ", '~', '~', '~')" and replace with a trailing comma and close parenthesis ",)" 

# for i in lst:
#   print(i+tuple(replace))


# ********************************************************************************
# Retrieve data from raw_card_data_from_API to seed 'cards' table in db
# ********************************************************************************
cards = data["results"]

all_bonuses = SignupBonus.query.all()

bonus_types=[]
bonus_ids=[]

for bonus in all_bonuses:
  bonus_types.append({"amount": bonus.amount, "spend": bonus.spend, "currency": bonus.currency, "month_period": bonus.month_period})
  bonus_ids.append(bonus.id)  

replace='~~~'  # in the seed file, will find ", '~', '~', '~')" and replace with a trailing comma and close parenthesis ",)" 

for c, card in enumerate(cards, 1):
  if card['rewards_type'] == None:
    lst=[]
    for r in card['rewards']:
      lst.append(r['title'])
    
    membership_rewards = next((True for l in lst if 'membership rewards' in l), False)
    points = next((True for l in lst if 'point' in l.lower()), False)
    miles = next((True for l in lst if 'mile' in l.lower()), False)
    cash = next((True for l in lst if 'cash' in l.lower()), False)
    life_miles = next((True for l in lst if 'lifemiles' in l.lower()), False)
    rebates = next((True for l in lst if 'rebate' in l.lower()), False)       
    back = next((True for l in lst if 'back' in l.lower()), False) 
    MCO = next((True for l in lst if 'mco rewards' in l.lower()), False)
    marriott = next((True for l in lst if 'marriott bonvoy' in l.lower()), False)
    starbucks = next((True for l in lst if 'star' in l.lower()), False)

    if card['_id'] in ['5e690b260b077d5830cada3b','5e690b260b077d5830cada3c','5e690b260b077d5830cada38','5e690b260b077d5830cadb1e','5e690b260b077d5830cadb1f']:
      card['rewards_type'] = 2 #AAdvantage Miles
    elif card['_id'] in ['5e690b260b077d5830cae1f7','5e690b260b077d5830cae1f8','5e690b260b077d5830cae1f9','5e690b260b077d5830cada43','5e690b260b077d5830cadd9f','5e690b260b077d5830cadeba']:
      card['rewards_type'] = 1                          
    elif card['_id'] in ['5e690b260b077d5830cae393','5e690b260b077d5830cae395','5e690b260b077d5830cae39b','5e690b260b077d5830cae39c']:
      card['rewards_type'] = 16 #United MileagePlus Miles
    elif card['_id'] in ['5e690b260b077d5830cada7c','5e690b260b077d5830cada7d','5e690b260b077d5830cae2cd','5e690b260b077d5830cadb18','5e690b260b077d5830cadd71','5e690b260b077d5830cadea1','5e690b260b077d5830cae3cb','5e690b260b077d5830cadb1e','5e690b260b077d5830cadb1f']:
      card['rewards_type'] = 20 #points    
    elif membership_rewards:
      card['rewards_type'] = 9
    elif life_miles:
      card['rewards_type'] = 18
    elif marriott:
      card['rewards_type'] = 8   
    elif points:
      card['rewards_type'] = 19
    elif miles:
      card['rewards_type'] = 20
    elif cash:
      card['rewards_type'] = 1
    elif rebates:
      card['rewards_type'] = 1
    elif back:
      card['rewards_type'] = 1
    elif MCO:
      card['rewards_type'] = 19 #points
    elif starbucks:
      card['rewards_type'] = 19 #points
    else:
      card['rewards_type'] = 21


  index = bonus_types.index(card['bonus'])
  card['bonus']=bonus_ids[index]

  print(( 
    card['_id'],
    card['title'], 
    card['original_title'], 
    card['fee'], 
    card['url'],
    card['foreign_fee'],
    card['rewards_type'],
    card['bank']['_id'],
    card['bonus'])+tuple(replace))


# ********************************************************************************
# Retrieve data from raw_card_data_from_API to seed 'cards_categories_rates' table in db
# ********************************************************************************
# cards = data["results"]

# reward_rates = RewardRate.query.all()

# # for i, r in enumerate(reward_rates, 1):
# #   print(i, r)

# rate_types=[]

# rate_ids=[]

# for rate in reward_rates:
#     rate_types.append({"points": rate.points, "description": rate.description})
#     rate_ids.append(rate.id)  
# # for i, r in enumerate(rate_types, 1):
# #   print(i, r)

# for c, card in enumerate(cards, 1):
#     earnings = card['earnings']
#     for earning in earnings:
#         rate_type = {"points": earning['points'], "description": earning['description']}
#         idx = rate_types.index(rate_type)  
#         print((card['_id'], earning['category'], rate_ids[idx]))




