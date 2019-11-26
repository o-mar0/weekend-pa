class RemoveDueFromTasks < ActiveRecord::Migration[5.2]
  def change
    remove_column :tasks, :due, :string
  end
end
