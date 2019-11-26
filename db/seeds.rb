puts 'clearing category database'
Category.destroy_all

puts 'clearing user database'
User.destroy_all

puts 'Clearing tasks database..'
Task.destroy_all

puts 'Creating users'
User.create(name: 'Omar', email: 'omar@gmail.com',password: 'password')

puts 'creating categories'
categories = [{name: 'groceries', label:'groceries'}, {name: 'appointments', label: 'appointments'}, {name: 'general', label: 'general'}]
categories.each do |category|
  Category.create(name:category[0], label:category[1])
  end


puts 'Creating tasks....'
tasks_past = [
  {
    title: 'Grocery shopping',
    category_id: Category.find_by(name: 'groceries'),
    location: 'Coles - 150/160 Swan St, Richmond VIC 3121',
    status: true,
    due: DateTime.parse('03/11/2019 23:59'),
    user_id: User.first
  },

  {
    title: 'Make dinner reservation',
    category_id: Category.find_by(name: 'appointments'),
    location: 'Macelleria - 87/89 Swan St, Richmond VIC 3121',
    status: true,
    start_at: DateTime.parse('03/11/2019 19:30'),
    end_at: DateTime.parse('03/11/2019 21:30'),
    due: DateTime.parse('02/11/2019 23:59'),
    user_id: User.first
  },

  {
    title: 'Go on a walk with Katie',
    category_id: Category.find_by(name: 'appointments'),
    location: 'Alexandra Park - Melbourne VIC 3004',
    status: true,
    start_at: DateTime.parse('02/11/2019 17:00'),
    end_at: DateTime.parse('02/11/2019 19:00'),
    due: DateTime.parse('02/11/2019 19:00'),
    user_id: User.first
  },

  {
    title: 'Pay for piano lessons',
    category_id: Category.find_by(name: 'general'),
    location: 'Richmond Music Academy - 369 Burnley St, Richmond VIC 3121',
    status: true,
    due: DateTime.parse('03/11/2019 23:59'),
    user_id: User.first
  },

  {
    title: 'Call parents',
    category_id: Category.find_by(name: 'general'),
    location: 'Home - 41 Stewart St, Melbourne c/o Inspire9, Level1, Richmond VIC 3121',
    status: true,
    due: DateTime.parse('03/11/2019 23:59'),
    user_id: User.first
  },

  {
    title: 'Install ceiling fan',
    category_id: Category.find_by(name: 'general'),
    location: 'Home - 41 Stewart St, Melbourne c/o Inspire9, Level1, Richmond VIC 3121',
    status: true,
    due: DateTime.parse('10/11/2019 23:59'),
    user_id: User.first
  },

  {
    title: 'Fix bathroom door',
    category_id: Category.find_by(name: 'general'),
    location: 'Home - 41 Stewart St, Melbourne c/o Inspire9, Level1, Richmond VIC 3121',
    status: true,
    due: DateTime.parse('10/11/2019 23:59'),
    user_id: User.first
  },

  {
    title: 'Help Katie to decorate her room',
    category_id: Category.find_by(name: 'appointments'),
    location: 'Katie\'s Place - 200 Elizabeth St Melbourne VIC 3000',
    status: true,
    start_at: DateTime.parse('09/11/2019 14:00'),
    end_at: DateTime.parse('09/11/2019 21:00'),
    due: DateTime.parse('09/11/2019 21:00'),
    user_id: User.first
  },

  {
    title: 'Buy chairs from IKEA',
    category_id: Category.find_by(name: 'general'),
    location: 'IKEA - 630 Victoria St, Richmond VIC 3121',
    status: true,
    due: DateTime.parse('17/11/2019 23:59'),
    user_id: User.first
  },

  {
    title: 'Complete online studies',
    category_id: Category.find_by(name: 'general'),
    location: 'Home - 41 Stewart St, Melbourne c/o Inspire9, Level1, Richmond VIC 3121',
    status: true,
    due: DateTime.parse('17/11/2019 23:59'),
    user_id: User.first
  }
]

tasks_past.each do |task|
  Task.create(task)
end
puts 'Tasks_past created!'

tasks_future = [
  {
    title: 'Babysit Alec',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Cambridge Court Apartments - 45 Victoria Parade, Collingwood VIC 3066',
    status: false,
    start_at: DateTime.parse('14/12/2019 16:00'),
    end_at: DateTime.parse('14/12/2019 18:30'),
    due: DateTime.parse('14/12/2019 16:00'),
    user_id: User.first.id
  },

  {
    title: 'Help Marty with JavaScript',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'StayCentral Serviced Apartments - 12 Acland St, St Kilda VIC 3182',
    status: false,
    start_at: DateTime.parse('15/12/2019 10:30'),
    end_at: DateTime.parse('15/12/2019 14:00'),
    due: DateTime.parse('15/12/2019 10:30'),
    user_id: User.first.id
  },

  {
    title: 'Appointment with barber',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Beef\'s Barbers - 258 Bridge Rd, Richmond VIC 3121',
    status: false,
    start_at: DateTime.parse('14/12/2019 11:00'),
    end_at: DateTime.parse('14/12/2019 11:45'),
    due: DateTime.parse('14/12/2019 11:00'),
    user_id: User.first.id
  },

  {
    title: 'Doctor\'s appointment',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Richmond Medical - 9/53 Coppin St, Richmond VIC 3121',
    status: false,
    start_at: DateTime.parse('15/12/2019 09:00'),
    end_at: DateTime.parse('15/12/2019 10:00'),
    due: DateTime.parse('15/12/2019 09:00'),
    user_id: User.first.id
  },

  {
    title: 'Meeting at community center',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Richmond Recreation Centre - 11-15 Gleadell St, Richmond VIC 3121',
    status: false,
    start_at: DateTime.parse('15/12/2019 14:30'),
    end_at: DateTime.parse('15/12/2019 15:00'),
    due: DateTime.parse('15/12/2019 14:30'),
    user_id: User.first.id
  },

  {
    title: 'Volunteer work at community center',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Richmond Recreation Centre - 11-15 Gleadell St, Richmond VIC 3121',
    status: false,
    start_at: DateTime.parse('15/12/2019 15:00'),
    end_at: DateTime.parse('15/12/2019 16:30'),
    due: DateTime.parse('15/12/2019 15:00'),
    user_id: User.first.id
  },

  {
    title: 'Christmas party at workplace',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Grand Hyatt - 123 Collins St, Melbourne VIC 3000',
    status: false,
    start_at: DateTime.parse('14/12/2019 19:00'),
    end_at: DateTime.parse('14/12/2019 23:00'),
    due: DateTime.parse('14/12/2019 19:00'),
    user_id: User.first.id
  },

  {
    title: 'Watch Cricket match',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Melbourne Cricket Ground - Brunton Ave, Richmond VIC 3002',
    status: false,
    start_at: DateTime.parse('15/12/2019 19:00'),
    end_at: DateTime.parse('15/12/2019 23:00'),
    due: ateTime.parse('15/12/2019 19:00'),
    user_id: User.first.id
  }

]

tasks_future.each do |task|
  Task.create(task)
end
puts 'Tasks_future created!'

tasks_present = [ # 6th
  {
    title: 'Dentist appointment',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Richmond Smiles Dental - 43 Clifton St, Richmond VIC 3121',
    status: false,
    start_at: DateTime.parse('06/12/2019 08:00'),
    end_at: DateTime.parse('06/12/2019 09:00'),
    due: DateTime.parse('06/12/2019 08:00'),
    user_id: User.first.id
  },

  {
    title: 'Post office/ post the letter',
    category_id: Category.find_by(name: 'general').id,
    location: 'Australia Post - shop 1/335-341 Bridge Rd, Richmond VIC 3121',
    status: false,
    due: DateTime.parse('06/12/2019 11:59'),
    user_id: User.first.id
  },

  {
    title: 'Car service appointment',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Grand Hyatt - 123 Collins St, Melbourne VIC 3000',
    status: false,
    start_at: DateTime.parse('06/12/2019 12:00'),
    end_at: DateTime.parse('06/12/2019 14:00'),
    due: DateTime.parse('06/12/2019 12:00'),
    user_id: User.first.id
  },

  {
    title: 'Contact weed dealer',
    category_id: Category.find_by(name: 'general').id,
    location: 'Classified location in Richmond (49 Dove St, Richmond VIC 3121)',
    status: false,
    due: DateTime.parse('06/12/2019 15:00'),
    user_id: User.first.id
  },

  {
    title: 'Reserve a book from the library',
    category_id: Category.find_by(name: 'general').id,
    location: 'Richmond Library - 415 Church St, Richmond VIC 3121',
    status: false,
    due: DateTime.parse('06/12/2019 16:59'),
    user_id: User.first.id
  },

  {
    title: 'Church visit',
    category_id: Category.find_by(name: 'general').id,
    location: 'St John Catholic Church - 594 Victoria Parade, East Melbourne VIC 3002',
    status: false,
    due: DateTime.parse('06/12/2019 18:00'),
    user_id: User.first.id
  },

  {
    title: 'Listen to the podcast',
    category_id: Category.find_by(name: 'general').id,
    location: 'Can be at any location',
    status: false,
    due: DateTime.parse('06/12/2019 23:59'),
    user_id: User.first.id
  },

  {
    title: 'Dinner Date',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Supernormal - 180 Flinders Ln, Melbourne VIC 3000',
    status: false,
    start_at: DateTime.parse('06/12/2019 19:30'),
    end_at: DateTime.parse('06/12/2019 21:00'),
    due: DateTime.parse('06/12/2019 19:30'),
    user_id: User.first.id
  },

  {
    title: 'Clean and arrange my room',
    category_id: Category.find_by(name: 'general').id,
    location: 'Home - 41 Stewart St, Melbourne c/o Inspire9, Level1, Richmond VIC 3121',
    status: false,
    due: DateTime.parse('06/12/2019 23:59'),
    user_id: User.first.id
  },

  {
    title: 'Visit Yoga class',
    category_id: Category.find_by(name: 'appointments').id,
    location: 'Yoga 213 - 97 Swan St, Richmond VIC 3121',
    status: false,
    start_at: DateTime.parse('07/12/2019 08:30'),
    end_at: DateTime.parse('07/12/2019 10:30'),
    due: DateTime.parse('07/12/2019 08:30'),
    user_id: User.first.id
  },
]

tasks_present.each do |task|
  Task.create(task)
end
puts 'Tasks_present created!'
