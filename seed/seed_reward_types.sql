-- from the terminal run:
-- psql < seed_reward_types.sql


-- \c capstone_one

DROP TABLE IF EXISTS reward_types;

CREATE TABLE reward_types
(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

  INSERT INTO reward_types
    (id, name)
  VALUES
(1, 'Cash Rewards'),
(2, 'AAdvantage Miles'),
(3, 'Avios'),
(4, 'Delta SkyMiles'),
(5, 'Hilton Honors Points'),
(6, 'HSBC Rewards Program Points'),
(7, 'IHG Rewards Points'),
(8, 'Marriott Bonvoy Points'),
(9, 'Membership Rewards Points'),
(10, 'NFCU Rewards Points'),
(11, 'Rapid Rewards Points'),
(12, 'ScoreCard Points'),
(13, 'Spark Miles'),
(14, 'ThankYou Points'),
(15, 'Ultimate Rewards Points'),
(16, 'United MileagePlus Miles'),
(17, 'Venture Rewards Miles'),
(18, 'Life Miles'),
(19, 'Points Rewards'),
(20, 'Miles Rewards'),
(21, 'None')