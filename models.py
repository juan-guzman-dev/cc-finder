"""SQLAlchemy models for capstone-one."""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()

DEFAULT_IMAGE= "/static/images/white-credit-card.jpg"

def connect_db(app):
    """Connect this database to Flask app."""

    db.app = app
    db.init_app(app)

def formatNumber(num):
    """Remove decimal place if integer"""
    if num % 1 == 0:
      return int(num)
    else:
      return num

def friendly_num(num):
    """Return number with commas as thousands separators."""

    return '{:0,.0f}'.format(num)   


class Card(db.Model):
    """Cards."""

    __tablename__ = "cards"

    _id = db.Column(db.Text, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    original_title = db.Column(db.Text, nullable=False)
    fee = db.Column(db.Integer)
    url = db.Column(db.Text)
    foreign_fee = db.Column(db.Boolean)    
    image = db.Column(db.Text)
    reward_type_id = db.Column(db.Integer, db.ForeignKey('reward_types.id'), nullable=False)
    bank_id = db.Column(db.Text, db.ForeignKey('banks._id'), nullable=False)
    signup_bonus_id = db.Column(db.Integer, db.ForeignKey('signup_bonus.id'))    

    # direct navigation: Card -> ProductDetail & back.
    product_details = db.relationship("ProductDetail", backref="card", cascade="all, delete-orphan")

    # direct navigation: Card -> CardCategoryRate & back
    rewards = db.relationship('CardCategoryRate',
                                  backref='card', cascade="all, delete-orphan")

    # "Through" navigation: Card -> EarningCategory & back
    earning_categories = db.relationship('EarningCategory',
                               secondary='cards_categories_rates',
                               backref='cards')

    # "Through" navigation: Card -> RewardRate & back
    reward_rates = db.relationship('RewardRate',
                               secondary='cards_categories_rates',
                               backref='cards') 


    def __repr__(self):
        """Show info about card."""

        c = self
        return f"<Id: {c._id}, Title: {c.title}, Bank: {c.bank.full_name}>"    

    
    def image_url(self):
        """Return image for card -- bespoke or generic."""

        return self.image or DEFAULT_IMAGE

    @property
    def friendly_fee(self):
        """Return 'Yes' if True, 'No' if False."""

        fee = 'Yes' if self.foreign_fee else 'No'
        
        return fee

    @property
    def rate_range(self):
        """Return range for reward rate."""
        lst = []
        for r in self.reward_rates:
            lst.append(r.points)
        if not lst:
            return '0'
        else:
            if all(v == 0 for v in lst):
                return '0'
            else:
                max_points=formatNumber(max(lst))
                min_points=formatNumber(min(lst))
                if max_points==min_points:
                    return f"{min_points}x"
                else:
                    return f"{min_points}x-{max_points}x"

    @property
    def air_pts(self):
        """Return Airline points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==1:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def cable_pts(self):
        """Return Cable points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==2:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def car_pts(self):
        """Return Car Rental points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==3:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def dept_pts(self):
        """Return Department Store points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==4:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def drug_pts(self):
        """Return Drug Store points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==5:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def entertain_pts(self):
        """Return Entertainment points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==6:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def everywhere_pts(self):
        """Return Everywhere points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==7:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def gas_pts(self):
        """Return Gas Station points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==8:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def home_pts(self):
        """Return Home Improvement Store points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==9:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def hotel_pts(self):
        """Return Hotel points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==10:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def office_pts(self):
        """Return Office Supply Store points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==11:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def online_pts(self):
        """Return Online Shopping points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==12:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def phone_pts(self):
        """Return Phone Service points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==13:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def restaurant_pts(self):
        """Return Restaurant points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==14:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def select_pts(self):
        """Return Selectable Category points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==15:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def supermarket_pts(self):
        """Return Supermarket points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==16:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    @property
    def utility_pts(self):
        """Return Utility points or zero."""
        lst=[]
        for r in self.rewards:
            if r.earning_category_id==17:
                lst.append(r.reward_rate.points)
        if lst:
            return lst[0]
        else:
            return 0

    # @property
    # def rewards_program(self):
    #     """Return a rewards program if None (reward_type.id == 18)"""
    #     if self.reward_type.id != 18:
    #         return self.reward_type.name         
        
    #     if self.reward_type.id == 18:
    #         if self._id in ['5e690b260b077d5830cada7c','5e690b260b077d5830cada7d']:
    #             return 'Amazon Rewards or Payment Terms'
    #         if self._id in ['5e690b260b077d5830cada3b','5e690b260b077d5830cada3c','5e690b260b077d5830cada38']:
    #             return 'AAdvantage Miles'
    #         if self._id in ['5e690b260b077d5830cadb1e','5e690b260b077d5830cadb1f']: # Bed Bath & Beyond
    #             return 'Rewards and Special Financing'
    #         if self._id in ['5e690b260b077d5830cae1f7','5e690b260b077d5830cae1f8','5e690b260b077d5830cae1f9']: # Sam's Club
    #             return 'Cash'                           
    #         if self._id in ['5e690b260b077d5830cae393','5e690b260b077d5830cae395','5e690b260b077d5830cae39b','5e690b260b077d5830cae39c']:
    #             return 'United MileagePlus Miles'
    #         if self._id in ['5e690b260b077d5830cae2cd','5e690b260b077d5830cadb18']: # State Farm and BBVA
    #             return 'Points'
                 
    #         else:
    #             lst = []
    #             for r in self.reward_rates:
    #                 lst.append(r.description.lower())

    #             membership_rewards = next((True for l in lst if 'membership rewards' in l), False)
    #             points = next((True for l in lst if 'point' in l), False)
    #             miles = next((True for l in lst if 'mile' in l), False)
    #             cash = next((True for l in lst if 'cash' in l), False)
    #             life_miles = next((True for l in lst if 'lifemiles' in l), False)
    #             rebates = next((True for l in lst if 'rebate' in l), False)       
    #             back = next((True for l in lst if 'back' in l), False) 
    #             MCO = next((True for l in lst if 'mco rewards' in l), False)
    #             marriott = next((True for l in lst if 'marriott bonvoy' in l), False)
    #             starbucks = next((True for l in lst if 'star' in l), False)               

    #             if membership_rewards:
    #                 return 'Membership Rewards Points'
    #             if life_miles:
    #                 return 'LifeMiles'
    #             if marriott:
    #                 return 'Marriott Bonvoy points'   
    #             if points:
    #                 return 'Points'
    #             if miles:
    #                 return 'Miles'
    #             if cash:
    #                 return 'Cash'
    #             if rebates:
    #                 return 'Rebates'
    #             if back:
    #                 return 'Cash'
    #             if MCO:
    #                 return 'MCO Rewards'
    #             if starbucks:
    #                 return 'Starbucks Stars'                 


class Bank(db.Model):
    """Banks."""

    __tablename__ = "banks"

    _id = db.Column(db.Text, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    full_name = db.Column(db.Text, nullable=False)
    address = db.Column(db.Text)
    insurance_type = db.Column(db.Text)
    insurance_id = db.Column(db.Text)    
    website = db.Column(db.Text)

    # direct navigation: Bank -> Card & back.
    cards = db.relationship("Card", backref="bank", cascade="all, delete-orphan") 

    def __repr__(self):
        """Show info about bank."""

        b = self
        return f"<Id: {b._id}, Full Name: {b.full_name}>"    


class EarningCategory(db.Model):
    """Earning categories."""

    __tablename__ = "earning_categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)

    def __repr__(self):
        """Show info about earning category."""

        c = self
        return f"<Id: {c.id}, Name: {c.name}>"


class RewardType(db.Model):
    """Reward types."""

    __tablename__ = "reward_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)

    # direct navigation: RewardType -> Card & back.
    cards = db.relationship("Card", backref="reward_type") 

    def __repr__(self):
        """Show info about rewards type."""

        t = self
        return f"<Id: {t.id}, Name: {t.name}>"           


class ProductDetail(db.Model):
    """Product details."""

    __tablename__ = "product_details"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    card_id = db.Column(db.Text, db.ForeignKey('cards._id'), nullable=False)
    title = db.Column(db.Text)    

    def __repr__(self):
        """Show info about product details."""

        d = self

        return f"<Id: {d.id}, Card_id: {d.card_id}, Title: {d.title}>"      

class RewardRate(db.Model):
    """Reward Rates."""

    __tablename__ = "reward_rates"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    points = db.Column(db.Float)
    description = db.Column(db.Text)

    def __repr__(self):
        """Show info about rewards rates."""

        e = self
        return f"<Id: {e.id}, Points: {e.points}, Description: {e.description}>"

    def friendly_rate(self):
        """Return formatted reward rate."""

        return f"{formatNumber(self.points)}x"    


class SignupBonus(db.Model):
    """Sign up bonuses."""

    __tablename__ = "signup_bonus"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    amount = db.Column(db.Integer)
    spend = db.Column(db.Integer)
    currency = db.Column(db.Text)
    month_period = db.Column(db.Integer) 

    # direct navigation: SignupBonus -> Card & back.
    cards = db.relationship("Card", backref="signup_bonus") 

    def __repr__(self):
        """Show info about sign up bonus."""

        b = self
        return f"<Id: {b.id}, Amount: {b.amount}, Spend: {b.spend}, Currency: {b.currency}, Month Period: {b.month_period}>"

    @property
    def friendly_bonus(self):
        """Return bonus with commas as thousands separators."""

        return '{:0,.0f}'.format(self.amount)    


    @property
    def description(self):
        """Return sencence describing bonus."""

        return f"Earn bonus after you spend ${friendly_num(self.spend)} on purchases in the first {self.month_period} months from account opening." 



class CardCategoryRate(db.Model):
    """Earning Categories and Reward Rates on a card."""

    __tablename__ = "cards_categories_rates"

    card_id = db.Column(db.Text, db.ForeignKey('cards._id'), primary_key=True)
    earning_category_id = db.Column(db.Integer, db.ForeignKey('earning_categories.id'), primary_key=True)
    reward_rate_id = db.Column(db.Integer, db.ForeignKey('reward_rates.id'), primary_key=True)

    earning_category = db.relationship('EarningCategory')
    reward_rate = db.relationship('RewardRate')


