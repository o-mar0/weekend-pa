class ChangeLocationDefaultToNilFromTasks < ActiveRecord::Migration[5.2]
  def change
    change_column_default :tasks, :location, from: '', to: nil
  end
end
