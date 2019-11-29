class MissionController < ApplicationController
  def mission_builder
    user_lat = params[:lat].to_f.round(2)
    user_long = params[:long].to_f.round(2)

    @tasks_with_location = current_user.tasks.near([user_lat, user_long], 10)

    @tasks_no_location = current_user.tasks.where(location: nil).order(:due)
    raise
    # Hash - tasks with no location
    @tasks_no_location_categories = {}
    @category_labels = {}
    @tasks_no_location.each do |task|
      if @tasks_no_location_categories.include? task.category.label
        @tasks_no_location_categories[task.category.name].push(task)
      else
        @tasks_no_location_categories[task.category.name] = [task]
        @category_labels[task.category.name] = task.category.label
      end
    end
  end

  def accepted_mission
    @category_labels = {}
    params[:task_categories].each do |task|
      next unless params[:category_name].include? task[0]

      tasks = task[1].map do |task_id|
        Task.find(task_id)
      end
      @category_labels[Category.find_by(name: task[0])] = tasks
    end
  end

    # @tasks = current_user.tasks
    # @tasks_categories = {}

    # @category_labels = {}

    # @tasks.each do |task|
    #   if @tasks_categories.include? task.category.label
    #     @tasks_categories[task.category.name].push(task)
    #   else
    #     @tasks_categories[task.category.name] = [task]
    #     @category_labels[task.category.name] = task.category.label
    #   end
    # end
    # generate new array with tasks that can be achieved today
    # @todays_tasks = @tasks.select do |task|
    #   task.start_at.day == Date.today || task.start_at.nil?
    # end
end