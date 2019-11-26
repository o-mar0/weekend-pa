class RemoveEndAtFromTasks < ActiveRecord::Migration[5.2]
  def change
    remove_column :tasks, :end_at, :string
  end
end
