class MissionController < ApplicationController
  def mission_builder
    user_lat = params[:lat].to_f.round(2)
    user_long = params[:long].to_f.round(2)

    @location_tasks = current_user.tasks.near([user_lat, user_long], 10).where(status: false)
    @category_tasks = current_user.tasks.where(location: '').order(:due).where(status: false)

    @category_labels = {}
    @categories = []
    @mission_legs = []

    mission_leg_count = @location_tasks.length

    # Hash - tasks with no location
    @category_tasks_categories = {}
    @category_tasks.each do |task|
      if @category_tasks_categories.include? task.category.name
        @category_tasks_categories[task.category.name].push(task)
      else
        @category_tasks_categories[task.category.name] = [task]
        @category_labels[task.category.name] = task.category.label
        @categories.push(task.category.name)
      end
    end

    tasks_per_mission_leg = (@categories.length / mission_leg_count).ceil
    chunked_categories = @categories.each_slice(tasks_per_mission_leg).to_a
    @categories_by_location_task = {}

    @location_tasks_categories = {}
    @location_tasks.each_with_index do |task, index|
      if @location_tasks_categories.include? task.category.name
        @location_tasks_categories[task.category.name].push(task)
      else
        @location_tasks_categories[task.category.name] = [task]
        @category_labels[task.category.name] = task.category.label
      end

      @chunked_tasks = chunked_categories[index]
      @categories_by_location_task[task.id] = @chunked_tasks
    end

    # @mission_legs = []
    #  # Add 1 for getting back home.
    # @mission_leg_count = @location_tasks.count + 1
    # @tasks_per_mission_leg = (@category_tasks.count / @mission_leg_count).ceil
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
