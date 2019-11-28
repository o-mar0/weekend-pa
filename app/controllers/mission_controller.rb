class MissionController < ApplicationController
  def mission_builder
    @tasks = Task.all.select { |task| task.user == current_user }
    @tasks_categories = {}

    @category_labels = {}


    @tasks.each do |task|
      if @tasks_categories.include? task.category.label
        @tasks_categories[task.category.name].push(task)
      else
        @tasks_categories[task.category.name] = [task]
        @category_labels[task.category.name] = task.category.label
      end
    end
    # generate new array with tasks that can be achieved today
    # @todays_tasks = @tasks.select do |task|
    #   task.start_at.day == Date.today || task.start_at.nil?
    # end
  end
end
