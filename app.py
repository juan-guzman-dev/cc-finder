from flask import Flask, request, redirect, render_template, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Card, Bank, EarningCategory, RewardType, ProductDetail, RewardRate, SignupBonus, CardCategoryRate
import functools
import os


app = Flask(__name__)
# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL','postgresql:///capstone_one')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', "0450fd10c2e411ea8adafbeacea3ee13")
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

toolbar = DebugToolbarExtension(app)

connect_db(app)



"""                           CLEAN UP CARDS INFO FROM API 
- Pull IDs of rewards cards. Those are the cards included in "cards_categories_rates" table. There are 415 rewards cards IDs.
- Non-rewards cards in the API have an empty earnings list:  "earnings": []   However, there are card instances that have an "earnings" 
list that looks like this:

"earnings": [
        {
          "points": 0,
          "description": "No cash back rewards.",
          "category": 7
        }]

Those cards need to be excluded from the rewards population. Let's call it population D (Delete).

There are other card instances with zero earnings in some categories but with earnings in others.

"earnings": [
        {
          "points": 3,
          "description": "Get 3% Cash Back on gas when you use your PIN at the pump and 1.5% Cash Back at all other gas stations.",
          "category": 8
        },
        {
          "points": 0,
          "description": "No other cash rewards.",
          "category": 7
        }        

Those cards need to be included. Let's call it population K (Keep).

"""

# pull cards ids of all cards in "cards_categories_rates" table
reward_cards_ids = db.session.query(CardCategoryRate.card_id).all()

# pull from rewards_rates table the reward_rate ids with points attribute == 0
points_no = db.session.query(RewardRate.id).filter(RewardRate.points==0).all()

# pull from rewards_rates table the reward_rate ids with points attribute != 0
points_yes = db.session.query(RewardRate.id).filter(RewardRate.points!=0).all()
    
# pull card ids in points_no.  This will include population D and K defined above.
cards_points_no = db.session.query(CardCategoryRate.card_id).filter(CardCategoryRate.reward_rate_id.in_(points_no)).all()

# pull card ids points_yes.  This will include K defined above.
cards_points_yes = db.session.query(CardCategoryRate.card_id).filter(CardCategoryRate.reward_rate_id.in_(points_yes)).all()

# let's now identify population K and exclude it from cards_zero_points
keep_lst=[]

for card in cards_points_no:
    if card in cards_points_yes:
        keep_lst.append(card)

cards_to_delete = [x for x in cards_points_no if x not in keep_lst]  # this is population D.  There are 47 cards IDs in it.

# Now we have our base population of "clean" rewards cards on which the user will apply the filters below
base_cards = db.session.query(Card).filter(Card._id.in_(reward_cards_ids)).filter(Card._id.notin_(cards_to_delete))  


##############################################################################
# Apply filter of Credit Card Companies

def other_banks_ids():
    """Return list with IDs of "Other Banks"."""

    main_bank_ids = [
        "5e685fbae89bb63d3d6b256f", # American Express
        "5e685f92e89bb63d3d6b2559", # Bank of America
        "5e685f92e89bb63d3d6b255a", # Barclaycard
        "5e685fe4e89bb63d3d6b257d", # Capital One
        "5e685f99e89bb63d3d6b255b", # Chase
        "5e685fece89bb63d3d6b2581", # Citibank
        "5e686204e89bb63d3d6b2660", # Discover
        "5e686201e89bb63d3d6b265f", # HSBC
        "5e685f8fe89bb63d3d6b2556", # U.S. Bank
        "5e6860a6e89bb63d3d6b25b7"] # Wells Fargo
    
    other_banks_ids = db.session.query(Bank._id).filter(Bank._id.notin_(main_bank_ids))
    return list(other_banks_ids)

other_banks_ids = other_banks_ids()
  

def filter_banks(c):
    """Handle Credit Card Company checkboxes from form."""

    main_banks_checked= request.form.getlist("main_banks")
    other_checked = request.form.get("other_banks")

    if not other_checked:                         
        return c.filter(Card.bank_id.in_(main_banks_checked))
    if not main_banks_checked:                         
        return c.filter(Card.bank_id.in_(other_banks_ids))
    else:
        banks_checked = main_banks_checked + other_banks_ids
        return c.filter(Card.bank_id.in_(banks_checked))               


##############################################################################
# Apply all other filters

def filter_intro_bonus(c):
    """Handle Intro Bonus checkbox from form."""

    intro_bonus_checked= request.form.get("intro_bonus")

    if intro_bonus_checked:                         
        return c.filter(Card.signup_bonus_id.in_(db.session.query(SignupBonus.id).filter(SignupBonus.amount>0)))
    if not intro_bonus_checked:
        return c


def filter_annual_fee(c):
    """Handle Annual Fee checkbox from form."""

    no_annual_fee_checked= request.form.get("annual_fee")

    if no_annual_fee_checked:                         
        return c.filter(Card.fee == 0)
    if not no_annual_fee_checked:                         
        return c


def filter_foreign_fee(c):
    """Handle Foreign Fee checkbox from form."""

    no_foreign_fee_checked= request.form.get("foreign_fee")

    if no_foreign_fee_checked:                         
        return c.filter(Card.foreign_fee == False)
    if not no_foreign_fee_checked:                         
        return c


def filter_earning_cats(c):
    """Handle Earning Categories checkboxes from form."""

    earn_cats_checked= request.form.getlist("earn_cats")
    card_ids = db.session.query(CardCategoryRate.card_id).filter(CardCategoryRate.earning_category_id.in_(earn_cats_checked)).all()
                            
    return c.filter(Card._id.in_(card_ids))


def filter_points(c):
    """Handle Rewards Points checkbox from form."""

    points_checked = request.form.get("points")
    
    if points_checked:                         
        return c
    if not points_checked:                         
        return c.filter(Card.reward_type_id.notin_([9,10,12,19]))


def filter_travel(c):
    """Handle Travel Rewards checkbox from form."""

    travel_checked = request.form.get("travel")
    
    if travel_checked:                         
        return c
    if not travel_checked:                         
        return c.filter(Card.reward_type_id.notin_([2,3,4,5,6,7,8,11,13,14,15,16,17,18,20]))


def filter_cash(c):
    """Handle Cash Rewards checkbox from form."""

    cash = request.form.get("cash")
    
    if cash:                         
        return c
    if not cash:                         
        return c.filter(Card.reward_type_id.notin_([1]))

##############################################################################
# Routes and error pages

@app.route('/')
def root():
    """Show homepage"""

    return render_template('home.html')


@app.errorhandler(404)
def page_not_found(e):
    """Show 404 NOT FOUND page."""

    return render_template('404.html'), 404

# ****************
def compose(*functions):
    return functools.reduce(lambda f, g: lambda x: f(g(x)), functions, lambda x: x)


@app.route('/credit-cards', methods=["GET","POST"])
def cards_index():
    """Show page with rewards cards."""

    earn_cats = db.session.query(EarningCategory).all()

    if request.method == 'POST':   
        filters = compose(filter_banks, filter_intro_bonus, filter_annual_fee, filter_foreign_fee, filter_earning_cats, filter_points, filter_travel, filter_cash)
        filtered_cards = filters(base_cards).all()
        return render_template('index.html', cards=filtered_cards, earn_cats=earn_cats)

    else:
        return render_template('index.html', cards=base_cards, earn_cats=earn_cats)
