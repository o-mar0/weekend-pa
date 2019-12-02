class Task < ApplicationRecord
  belongs_to :category
  belongs_to :user

  geocoded_by :location
  after_validation :geocode, if: :will_save_change_to_location?

  validates :title, :category, presence: true
  validate :due_cannot_be_in_the_past, :start_at_cannot_be_in_the_past

  private

  def due_cannot_be_in_the_past
    return unless due.present? && due < Date.today

    errors.add(:due, "can't be in the past")
  end

  def start_at_cannot_be_in_the_past
    return unless start_at.present? && start_at < Date.today

    errors.add(:start_at, "can't be in the past")
  end
end
