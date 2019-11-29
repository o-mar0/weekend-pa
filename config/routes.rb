Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'

  resources :tasks
  get 'mission', to: 'mission#mission_builder', as: 'mission_builder'
  post 'mission', to: 'mission#accepted_mission', as: 'accepted_mission'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
