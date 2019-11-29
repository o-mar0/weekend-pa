class RemoveLocationFromTasks < ActiveRecord::Migration[5.2]
  def change
    remove_column :tasks, :location, :string
  end
end
