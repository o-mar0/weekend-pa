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
  end

  def accepted_mission
    @category_labels = {}

    @display_tasks = {}

    params[:location_tasks].each do |location_task_id|
      if params[:task].include? location_task_id
        @display_tasks[location_task_id] = { categories: [] }
        params[:task][location_task_id].each do |category_name|
          params[:task_categories].each do |category|
            next unless category_name[0] == category[0]

            category_tasks = category[1].map do |task_id|
              Task.find(task_id)
            end
            @display_tasks[location_task_id][:categories].push(Category.find_by(name: category[0]) => category_tasks)
          end
        end
        @display_tasks[location_task_id][:location_task] = Task.find(location_task_id)
      else
        @display_tasks[location_task_id] = { location_task: Task.find(location_task_id) }
      end
    end
  end
end
