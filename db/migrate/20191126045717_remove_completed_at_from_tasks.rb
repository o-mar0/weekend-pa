class RemoveCompletedAtFromTasks < ActiveRecord::Migration[5.2]
  def change
    remove_column :tasks, :completed_at, :string
  end
end
