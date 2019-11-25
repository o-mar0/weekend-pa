class Task < ApplicationRecord
  belongs_to :category
  belongs_to :user

  validates :title, :category, presence: true
end
