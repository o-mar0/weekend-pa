puts 'Clearing Database...'
Category.destroy_all
User.destroy_all
Task.destroy_all

puts 'Creating Users...'
User.create(name: 'User', email: 'user@user.com',password: 'password')

puts 'Creating Categories...'
categories = [
               {
                name: 'appointment',
                label:'Appointment'
               },
               {
                name: 'airport',
                label:'Airport'
               },
               {
                name: 'amusement_park',
                label: 'Amusement Park'
               },
               {
                name: 'aquarium',
                label: 'Aquarium'
               },
               {
                name: 'art_gallery',
                label: 'Art Gallery'
               },
               {
                name: 'atm',
                label: 'ATM'
               },
               {
                name: 'bakery',
                label: 'Bakery'
               },
               {
                name: 'bank',
                label: 'Bank'
               },
               {
                name: 'bar',
                label: 'Bar'
               },
               {
                name: 'cafe',
                label: 'Cafe'
               },
               {
                name: 'dentist',
                label: 'Dentist'
               },
               {
                name: 'department_store',
                label: 'Department Store'
               },
               {
                name: 'doctor',
                label: 'Doctor'
               },
               {
                name: 'electrician',
                label: 'Electrician'
               },
               {
                name: 'electronics_store',
                label: 'Electronics Store'
               },
               {
                name: 'grocery_or_supermarket',
                label: 'Grocery or Supermarket'
               },
               {
                name: 'gym',
                label: 'Gym'
               },
               {
                name: 'hardware_store',
                label: 'Hardware Store'
               },
               {
                name: 'home_goods_store',
                label: 'Home Goods Store'
               },
               {
                name: 'hospital',
                label: 'Hospital'
               },
               {
                name: 'laundry',
                label: 'Laundry'
               },
               {
                name: 'park',
                label: 'Park'
               },
               {
                name: 'pharmacy',
                label: 'Pharmacy'
               },
               {
                name: 'physiotherapist',
                label: 'Physiotherapist'
               },
               {
                name: 'plumber',
                label: 'Plumber'
               },
               {
                name: 'post_office',
                label: 'Post Office'
               },
               {
                name: 'restaurant',
                label: 'Restaurant'
               },
               {
                name: 'school',
                label: 'School'
               },
               {
                name: 'shopping_mall',
                label: 'Shopping Mall'
               },
               {
                name: 'store',
                label: 'Store'
               },
               {
                name: 'supermarket',
                label: 'Supermarket'
               },
               {
                name: 'tourist_attraction',
                label: 'Tourist Attraction'
               },
               {
                name: 'transit_station',
                label: 'Transit Station'
               },
               {
                name: 'veterinary_care',
                label: 'Vetinary Care'
               },
               {
                name: 'car_wash',
                label: 'Car Wash'
               },
               {
                name: 'spa',
                label: 'Spa'
               },
               {
                name: 'gas_station',
                label: 'Gas Station'
               },
             ]
categories.each do |category|
  Category.create(category)
end

###############################################################################


tasks = [
 ############################# LOCATION #############################
  {
    title: 'Buy a Gift For Vincent',
    category: Category.find_by(name: 'appointment'),
    location: '8 Whiteman St, Southbank VIC 3006',
    status: false,
    start_at: DateTime.parse('06/12/2019 19:00'),
    user: User.first
  },

  {
    title: 'Go back home to deliver things for party',
    category: Category.find_by(name: 'appointment'),
    location: '23 Highland St, Kingsbury, Victoria',
    start_at: DateTime.parse('06/12/2019 20:00'),
    status: false,
    user: User.first
  },

  # {
  #   title: 'Pick Up Vincent From The Airport',
  #   category: Category.find_by(name: 'appointment'),
  #   location: 'Melbourne Airport, Departure Dr, Melbourne Airport VIC',
  #   status: false,
  #   start_at: DateTime.parse('06/12/2019 20:30'),
  #   user: User.first
  # },

  {
    title: 'Go back home for the surprise party',
    category: Category.find_by(name: 'appointment'),
    location: '23 Highland St, Kingsbury, Victoria',
    start_at: DateTime.parse('06/12/2019 21:30'),
    status: false,
    user: User.first
  },

  ############################# Grocery or Supermarket #############################

  {
    title: 'Bread',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Milk',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Cheese',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'BBQ Charcoal',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Drinks',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Toilet Paper',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Hand Wash',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Vegetables',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Chicken Avo Salad',
    category: Category.find_by(name: 'grocery_or_supermarket'),
    location: '',
    status: false,
    user: User.first
  },

  ############################# 2. Hardware Store #############################

  {
    title: 'BBQ Grill',
    category: Category.find_by(name: 'hardware_store'),
    location: '',
    status: false,
    user: User.first
  },

  ############################# 3. cafe #############################

  {
    title: 'Get a croissant',
    category: Category.find_by(name: 'cafe'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Get a coffee',
    category: Category.find_by(name: 'cafe'),
    location: '',
    status: false,
    user: User.first
  },

  ############################# 4. #############################

  {
    title: 'Post office/ Purchase USB',
    category: Category.find_by(name: 'post_office'),
    location: '',
    status: false,
    user: User.first
  },

  ############################# 5. Car Wash #############################
  {
    title: 'Get a haircut',
    category: Category.find_by(name: 'shopping_mall'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Workout',
    category: Category.find_by(name: 'gym'),
    location: '',
    status: false,
    user: User.first
  },

  {
    title: 'Car wash',
    category: Category.find_by(name: 'car_wash'),
    location: '',
    location: '',
    status: false,
    user: User.first
  },

  ############################# other (filling) (NO TIME SHOULD BE SPECIFIED NOR LOCATION) #############################

  {
    title: 'Fuel up gas tank',
    category: Category.find_by(name: 'gas_station'),
    location: '',
    status: false,
    user: User.first
  },

  # {
  #   title: '',
  #   category: Category.find_by(name: ''),
  #   location: '',
  #   status: false,
  #   user: User.first
  # },

  # {
  #   title: '',
  #   category: Category.find_by(name: ''),
  #   location: '',
  #   status: false,
  #   user: User.first
  # },

  # {
  #   title: '',
  #   category: Category.find_by(name: ''),
  #   location: '',
  #   status: false,
  #   user: User.first
  # },

  # {
  #   title: '',
  #   category: Category.find_by(name: ''),
  #   location: '',
  #   status: false,
  #   user: User.first
  # },

]

tasks.each do |task|
  Task.create(task)
end
puts 'The Best Tasks Have Been Created!'
