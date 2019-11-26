class AddEndAtToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :end_at, :datetime
  end
end
