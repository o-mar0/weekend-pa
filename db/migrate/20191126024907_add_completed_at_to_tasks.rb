class AddCompletedAtToTasks < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :completed_at, :date
  end
end
