class RemoveStartAtFromTasks < ActiveRecord::Migration[5.2]
  def change
    remove_column :tasks, :start_at, :string
  end
end
